﻿/* Copyright (c) 1994-2018 Sage Software, Inc.  All rights reserved. */

"use strict";
/* Grid Columns Customization */
var GridPreferences = GridPreferences || {};
GridPreferences = {

    initialize: function (gridName, userPreferenceKey, btnEdit, gridColumns) {

        var grid = $(gridName).data('kendoGrid');

        // Adding attribute to Delete column for non-customize
        for (var i = 0; i < grid.columns.length; i++) {
            if (grid.columns[i].field === "Delete" || grid.columns[i].field === "Add") {
                $($(grid.columns[i]).attr("attributes")).attr("sg_Hold", true);
            }
        }

        GridPreferences.initializeInternal(gridName, userPreferenceKey, btnEdit, gridColumns);
    },

    //Should not call this method directly. This is for only for internal use
    initializeInternal: function (gridName, userPreferenceKey, btnEdit, gridColumns, postApplyCallback) {

        var grid = $(gridName).data('kendoGrid');

        //hide if there is preference window is opened. In case of multiple grids only 1 preference window can be opened.
        GridPreferences.hide();

        $(document).off('.gridPref');

        $(document).on('click.gridPref', "#btnGridPrefCancel", function () {
            GridPreferences.hide();
        });

        $(document).on('click.gridPref', "#chkGridPrefSelectAll", function () {
            GridPreferences.setCheckBox(this.checked);
        });

        $(document).on('click.gridPref', "[name='chkNewGridPref']", function () {
            GridPreferences.setHeaderCheckBox();
        });

        $(document).on('click.gridPref', function (e) {
            var container = $('#divGridPrefEditCols');
            // if the target of the click isn't the container... nor a descendant of the container
            if (!container.is(e.target) && !btnEdit.is(e.target) && container.has(e.target).length === 0) {
                GridPreferences.hide();
            }
        });

        $(document).off('click.gridPref', "#btnGridPrefApply");
        $(document).on('click.gridPref', "#btnGridPrefApply", function () {
            var data = { key: userPreferenceKey, value: GridPreferences.getSelectedColumns(grid) };
            window.sg.utls.ajaxPostHtml(window.sg.utls.url.buildUrl("Core", "Common", "SaveGridPreferences"), data);
            GridPreferencesHelper.loadGridPreferences(grid, data.value);
            GridPreferences.hide();
            // Invoke postApplyCallback if supplied
            if (postApplyCallback !== undefined) {
                postApplyCallback.call();
            }
        });

        $(document).off('click.gridPref', "#btnGridPrefRestore");
        $(document).on('click.gridPref', "#btnGridPrefRestore", function () {
            var data = { key: userPreferenceKey };
            window.sg.utls.ajaxPostHtml(window.sg.utls.url.buildUrl("Core", "Common", "DeleteUserPreference"), data);
            GridPreferences.restoreGridColumns(grid, gridColumns);
            GridPreferences.hide();
        });

        GridPreferences.showColumns(grid, btnEdit);
    },

    /**
     * Select/Unselect all checkbox fields
     * @method setCheckBox      
     * @param {} flag - checked state of header checkbox.
     */
    setCheckBox: function (flag) {
        $('#tblTBodyGridPref input[name=chkNewGridPref]').each(function () {
            if ($(this).is(':checkbox') && $(this).id != 'chkGridPrefSelectAll') {
                if (flag) {
                    $(this).prop('checked', true).applyCheckboxStyle();
                } else {
                    $(this).prop('checked', false).applyCheckboxStyle();
                }
            }
        });
    },
    /**
     * Check/Uncheck the "Select All" checkbox based on the selection of lsit of columns
     * @method setHeaderCheckBox      
     */
    setHeaderCheckBox: function () {
        $('#chkGridPrefSelectAll').prop('checked', true).applyCheckboxStyle();
        $('#tblTBodyGridPref input[name=chkNewGridPref]').each(function () {
            if ($(this).is(':checkbox') && !$(this).is(':checked')) {
                $('#chkGridPrefSelectAll').prop('checked', false).applyCheckboxStyle();
                return;
            }
        });
    },
    /**
     * Check the columns by skipping saved hidden columns
     * @method CheckGridPrefCols      
     * @param {} grid - instance of grid.
     */
    checkGridPrefCols: function (grid) {
        if (grid != null) {
            $('#tblTBodyGridPref input[name=chkNewGridPref]').each(function () {
                for (var i = 0; i < grid.columns.length; i++) {
                    if ($(this).attr('data-finder-key') === grid.columns[i].field) {
                        if (!grid.columns[i].hidden)
                            $(this).prop('checked', true).applyCheckboxStyle();
                        else {
                            $(this).prop('checked', false).applyCheckboxStyle();
                        }
                    }
                }
            });
        }
        GridPreferences.setHeaderCheckBox();
    },
    /**
     * Hide the list of columns
     * @method hide      
     */
    hide: function () {
        var container = $('#divGridPrefEditCols');
        container.hide();
        // Detach and Append the container (div) to the current parent, 
        // because this container not gets scrolled along with the page when loaded inside the popup
        //var parentForm = window.top.$('iframe.screenIframe:visible').contents().find('form:first');
        var parentForm = sg.utls.GridPrefParentForm;
        var kendoWindowContainer = container.closest('.k-window-content.k-content');
        if (parentForm !== null && parentForm.length > 0 && kendoWindowContainer !== null && kendoWindowContainer.length > 0) {
            container.detach();
            parentForm.append(container);
            sg.utls.GridPrefParentForm = "";
        }
    },
    /**
     * Show list of columns
     * @method showColumns      
     * @param {} grid - instance of grid.
     */
    showColumns: function (grid, btnEdit)
    {
        var container = $('#divGridPrefEditCols');
        var containerLeftPos = btnEdit.offset().left + 0;
        var containerTopPos = btnEdit.offset().top + 20;
            
        // Detach and Append the container (div) to the current parent, 
        // because this container not gets scrolled along with the page when loaded inside the popup
        var kendoWindowContainer = grid.element.closest('.k-window-content.k-content');
        if (kendoWindowContainer !== null && kendoWindowContainer.length > 0 && !kendoWindowContainer.data("kendoWindow").options.isMaximized) {
            sg.utls.GridPrefParentForm = container.parent();
            container.detach();
            grid.element.closest('.k-window-content.k-content').append(container);
            var parentKendoWindowPosition = kendoWindowContainer.closest('.k-widget.k-window').position();
            containerTopPos = containerTopPos - (parentKendoWindowPosition.top - kendoWindowContainer.scrollTop() + 45);
            containerLeftPos = containerLeftPos - (parentKendoWindowPosition.left + 21);
        }

        GridPreferences.populateColumnsFromGrid(grid);
        GridPreferences.checkGridPrefCols(grid);
        container.css({ top: containerTopPos, left: containerLeftPos, position: 'absolute', "z-index": "2147483647" });
        container.show();
    },
    /**
     * Get the columns from the grid for checkbox list
     * @method populateColumnsFromGrid      
     * @param {} grid - instance of grid.
     */
    populateColumnsFromGrid: function (grid) {
        var attributeNotExists;
        var customizable;
        var tableBody = $("#tblTBodyGridPref");
        if (grid == null) {
            return;
        } else {
            tableBody.empty();
        }

        for (var i = 0; i < grid.columns.length; i++) {
            attributeNotExists = false;

            if (!grid.columns[i].title) {
                continue;
            }

            if (grid.columns[i].attributes == null) {
                attributeNotExists = true;
            } else {
                customizable = grid.columns[i].attributes["sg_Customizable"];
            }

            if (typeof grid.columns[i].attributes !== 'undefined' && grid.columns[i].attributes["sg_Hold"]) {
                customizable = false;
            }

            if (attributeNotExists || customizable == null || customizable) {
                tableBody.append(window.gridPreferenceElements.listElement);
                var text = "";
                if (grid.columns[i].title) {
                    text = grid.columns[i].title;
                }
                else if (grid.columns[i].headerTemplate) {
                    text = $(grid.columns[i].headerTemplate).text()
                }
                tableBody.find("#chkNewGridPref").attr({
                    "id": "chkGridPref" + grid.columns[i].field,
                    "data-finder-key": grid.columns[i].field,
                    "value": sg.utls.htmlDecode(text)
                });
                tableBody.find("#lblNewGridPref").text(sg.utls.htmlDecode(text)).attr({
                    "id": "lblGridPref" + grid.columns[i].field,
                    "for": "chkGridPref" + grid.columns[i].field
                });
            }
        }
        tableBody.sortable({ cursor: "move" }).disableSelection();
    },
    /**
     * Restore the default columns in the grid
     * @method RestoreGridColumns      
     * @param {} grid - instance of grid.
     */
    restoreGridColumns: function (grid, gridColumns) {
        if (grid == null) {
            return;
        }
        var attributeNotExists;
        var customizable;
        for (var k = 0; k < gridColumns.length; k++) {
            for (var j = 0; j < grid.columns.length; j++) {
                if (grid.columns[j].field === gridColumns[k].field) {
                    attributeNotExists = false;
                    if (grid.columns[j].attributes == null) {
                        attributeNotExists = true;
                    } else {
                        customizable = grid.columns[j].attributes["sg_Customizable"];
                    }
                    grid.reorderColumn(k, grid.columns[j]);
                    if (grid.columns[k].title && (attributeNotExists || customizable == null || customizable)) {
                        grid.showColumn(grid.columns[k].field);
                    }
                    break;
                }
            }
        }
    },
    /**
     * Get the selected columns to save on click of 'Apply'
     * @method GetSelectedColumns      
     */
    getSelectedColumns: function (grid) {
        var selectedColumns = [];

        for (var i = 0; i < grid.columns.length; i++) {
            if (typeof grid.columns[i].attributes !== 'undefined' && grid.columns[i].attributes["sg_Hold"] != null && grid.columns[i].attributes["sg_Hold"]) {
                selectedColumns.push(GridPreferencesHelper.getGridColumn(grid.columns[i].field, true));
            }
        }

        $('#tblTBodyGridPref input[name=chkNewGridPref]').each(function () {
            if ($(this).is(':checkbox')) {
                selectedColumns.push(GridPreferencesHelper.getGridColumn($(this).attr('data-finder-key'), $(this).is(':checked')));
            }
        });
        return selectedColumns;
    },
};

var GridPreferencesHelper = GridPreferencesHelper || {};
GridPreferencesHelper = {
    /**
     * Initialize the User Preference events with non-customizable columns
     * @method initialize
     * @param {} gridName - name of the grid
     * @param {} userPreferenceKey - user preference key for the page/grid
     * @param {} btnEdit - "Edit Columns" button
     * @param {} gridColumns - default columns of the grid
     * @param {} columnsToHold - number of columns to visible and not customizable for user preference
     * @param {} postApplyCallback - callback event, if supplied, for post apply button click
     */
    initialize: function (gridName, userPreferenceKey, btnEdit, gridConfigColumns, columnsToHold, postApplyCallback) {
        var grid = $(gridName).data('kendoGrid');
        if (columnsToHold > 0) {
            for (var i = 0; i < gridConfigColumns.length; i++) {
                if (i < columnsToHold) {
                    if ($($(gridConfigColumns[i]).attr("attributes") == null || typeof ($($(gridConfigColumns[i]).attr("attributes")) == 'undefined'))) {
                        $($(gridConfigColumns[i]).attr("attributes", {}));
                    }
                    $($(grid.columns[i]).attr("attributes")).attr("sg_Hold", true);
                }
            }
        }
        GridPreferences.initializeInternal(gridName, userPreferenceKey, btnEdit, gridConfigColumns, postApplyCallback);
    },
    /**
     * Returns the GridColum object
     * @method getColumnIndex      
     * @param {} id - field name
     * @param {} isChecked - Whether the column is hidden or not
     */
    getGridColumn: function (id, isChecked) {
        var gridColumn = new Object();
        gridColumn.field = id;
        gridColumn.isHidden = !isChecked;
        return gridColumn;
    },
    /**
     * Hides the list of columns. This is added because div element(columns list) is not hiding while closing the popup which has editable grid.
     * @method close
     */
    hide: function () {
        if ($('#divGridPrefEditCols').length > 0) {
            GridPreferences.hide();
        }
    },
    /**
     * Returns true if grid column exists
     * @method IsGridColumnExists      
     * @param {} id - field name
     * @param {} gridColumns - list of grid columns
     */
    isGridColumnExists: function (id, gridColumns) {
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].field === id) {
                return true;
            }
        }
        return false;
    },

    /**
     * Returns true if grid column hidden
     * @method IsGridColumnHidden      
     * @param {} id - field name
     * @param {} gridColumns - list of grid columns
     */
    IsGridColumnHidden: function (id, gridColumns) {
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].field === id) {
                return gridColumns[i].isHidden;
            }
        }
        return false;
    },

    /**
     * Returns the current index of the specific column
     * @method getColumnIndex      
     * @param {} gridName - name of the grid
     * @param {} columnName - column name
     */
    getColumnIndex: function (gridName, columnName) {
        var grid = $(gridName).data('kendoGrid');
        return GridPreferencesHelper.getGridColumnIndex(grid, columnName);
    },

    /**
    * Returns the current index of the specific column
    * @method getColumnIndex      
    * @param {} gridName - name of the grid
    * @param {} columnName - column name
    * @param {} ignoreHidden - flag to ignoreHidden column
    */
    getGridColumnIndex: function ($grid, columnName, ignoreHidden) {
        var colIndex = null;
        var cols = $grid.columns;
        if(ignoreHidden) {
            cols = $.grep($grid.columns, function (n, i){
                return n.hidden === false;
            });
        }
    
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].field === columnName) {
                colIndex = i;
                break;
            }
        }
        return colIndex;
    },
    /**
     * Apply the saved user preferences (Column Reorder and Visibility) to the grid
     * @method LoadGridPreferences      
     * @param {} grid - instance of gri.d
     * @param {} result - list of saved grid columns
     */
    loadGridPreferences: function (grid, result) {
        if (grid == null || grid.columns == null) {
            return;
        }
        var index = 0;
        //Reorder column
        for (var k = 0; k < result.length; k++) {
            for (let j = 0; j < grid.columns.length; j++) {
                if (grid.columns[j].field === result[k].field && index < grid.columns.length) {
                    grid.reorderColumn(index, grid.columns[j]);
                    index++;
                    break;
                }
            }
        }
        //Show/Hide Column
        for (var i = 0; i < grid.columns.length; i++) {
            grid.showColumn(grid.columns[i].field);

            // hide column if column is hidden, and preference does not show it
            if (grid.columns[i].hidden) {
                let shouldHide = true;
                for (let j = 0; j < result.length; j++) {
                    if (result[j].field === grid.columns[i].field && !result[j].isHidden) {
                        shouldHide = false;
                        break;
                    }
                }
                if (shouldHide) {
                    grid.hideColumn(grid.columns[i].field);
                }
            }
            // hide column if is column is not hidden, but preference hides it
            else {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].field === grid.columns[i].field && result[j].isHidden) {
                        grid.hideColumn(grid.columns[i].field);
                        break;
                    }
                }
            }
        }
    },

    /** 
     * Apply the saved user preferences (Column Reorder and Visibility) to the grid 
     * @method setGrid      
     * @param {} grid - instance of gri.d 
     * @param {} result - list of saved grid columns 
     * @param {} isJSObject - true 
     */
    setGrid: function (gridName, result, isJSObject) {
        if (result === "" || result === false) {
            return;
        }
        if (!isJSObject) {
            result = JSON.parse(sg.utls.htmlDecode(result));
        }
        var grid = $(gridName).data('kendoGrid');
        GridPreferencesHelper.loadGridPreferences(grid, result);
    },

    /**
     * Gets the order of columns when the kendogrid columnReorder event is raised
     * @method getColumnOrder      
     * @param {} e - columnReorder event of grid.
     * @param {} gridName - Name of the grid
     */
    getColumnOrder: function (e, gridName) {
        var columns = [];
        var grid = $(gridName).data('kendoGrid');
        var tmp = GridPreferencesHelper.getGridColumn(grid.columns[e.oldIndex].field, grid.columns[e.oldIndex].hidden);
        for (var i = 0; i < grid.columns.length; i++) {
            if (grid.columns[i].field != tmp.field) {
                columns.push(GridPreferencesHelper.getGridColumn(grid.columns[i].field), grid.columns[i].hidden);
            }
        };
        columns.splice(e.newIndex, 0, tmp);
        return columns;
    },

    /**
     * save the order of columns when the kendogrid columnReorder event is raised
     * @method saveColumnOrder      
     * @param {} e - columnReorder event of grid.
     * @param {} gridName - Name of the grid
     * @param {} gridKey - GUID of the grid
     */
    saveColumnOrder: function (e, gridName, gridKey) {
        var grid = $(gridName).data('kendoGrid');
        if ((typeof e.column.reorderable != "undefined" && !e.column.reorderable) || (grid.columns[0].field === "Delete" && e.newIndex === 0 && e.oldIndex > 0)) {
            setTimeout(function () {
                grid.reorderColumn(e.oldIndex, grid.columns[e.newIndex]);
            }, 0);
            e.preventDefault();
            return;
        }
        var columns = GridPreferencesHelper.getColumnOrder(e, gridName);
        sg.utls.saveGridPreferences(gridKey, columns);
    },
};