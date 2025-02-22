﻿// The MIT License (MIT) 
// Copyright (c) 1994-2021 The Sage Group plc or its licensors.  All rights reserved.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of 
// this software and associated documentation files (the "Software"), to deal in 
// the Software without restriction, including without limitation the rights to use, 
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
// Software, and to permit persons to whom the Software is furnished to do so, 
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// @ts-check

"use strict";

var sourceJournalProfileReportUI = sourceJournalProfileReportUI || {};
sourceJournalProfileReportUI = {
    sourceJournalProfileReportModel: {},

    /**
     * @function
     * @name init
     * @description Primary Initialization Routine
     * @namespace sourceJournalProfileReportUI
     * @public
     */
    init: function () {
        sourceJournalProfileReportOnSuccess.display(sourceJournalProfileReportModel);
        sourceJournalProfileReportUI.initButton();
        sourceJournalProfileReportUI.initFinders();

        sg.controls.Focus($("#Data_Frjrnl"));
    },

    /**
     * @function
     * @name initFinders
     * @description Initialize the finders
     * @namespace sourceJournalProfileReportUI
     * @public
     */
    initFinders: function () {
        let info = sg.viewFinderProperties.GL.SourceJournalProfiles;
        let buttonId = "btnFromSrcJournalFinder";
        let dataControlIdOrSuccessCallback = onFinderSuccess.FromProfile;
        sg.viewFinderHelper.initFinder(buttonId, dataControlIdOrSuccessCallback, info, finderFilter.getFromProfileFilter);

        buttonId = "btnToSrcJournalFinder";
        dataControlIdOrSuccessCallback = onFinderSuccess.ToProfile;
        sg.viewFinderHelper.initFinder(buttonId, dataControlIdOrSuccessCallback, info, finderFilter.getToProfileFilter);
    },

    /**
     * @function
     * @name initKendoBindings
     * @description Initialize the Kendo bindings
     * @namespace sourceJournalProfileReportUI
     * @public
     */
    initKendoBindings: function () {
        sourceJournalProfileReportUI.sourceJournalProfileReportModel = ko.mapping.fromJS(sourceJournalProfileReportViewModel);
    },

    /**
     * @function
     * @name initButton
     * @description Initialize the buttons
     * @namespace sourceJournalProfileReportUI
     * @public
     */
    initButton: function () {
        $("#btnPrint").on('click', function () {
            if ($("#frmSourceJournalProfileReport").valid()) {
                sg.utls.clearValidations("frmSourceJournalProfileReport");
                let model = sourceJournalProfileReportUI.sourceJournalProfileReportModel.Data;

                let errorMessage = null;
                if (model.Frjrnl() > model.Tojrnl()) {
                    errorMessage = sourceJournalProfileReportResources.FromToErrorMessage;
                    sg.utls.showMessageInfo(sg.utls.msgType.ERROR, jQuery.validator.format(sourceJournalProfileReportResources.FromToErrorMessage, sourceJournalProfileReportResources.Profile));
                }

                setTimeout(function () {
                    if (!errorMessage) {
                        $("#message").empty();
                        let data = sg.utls.ko.toJS(model, sourceJournalProfileReportUI.computedProperties);
                        SourceJournalProfileReportRepository.executeSourceJournalProfileReportRepositoryReport(model);
                    }

                }, 150);
            }
        });
    }
};

var onFinderSuccess = {

    /**
     * @function
     * @name FromProfile
     * @description Event handler for successful finder selection
     * @namespace onFinderSuccess
     * @public
     * 
     * @param {object} result The JSON result payload
     */
    FromProfile: function (result) {
        if (result) {
            let sourceJournalName = result.SRCEJRNL;
            sourceJournalProfileReportUI.sourceJournalProfileReportModel.Data.Frjrnl(sourceJournalName);
            $("#Data_Frjrnl").val(sourceJournalName);
            sg.controls.Focus($("#Data_Tojrnl"));
        }
    },

    /**
     * @function
     * @name ToProfile
     * @description Event handler for successful finder selection
     * @namespace onFinderSuccess
     * @public
     *
     * @param {object} result The JSON result payload
     */
    ToProfile: function (result) {
        if (result) {
            let sourceJournalName = result.SRCEJRNL;
            sourceJournalProfileReportUI.sourceJournalProfileReportModel.Data.Tojrnl(sourceJournalName);
            $("#Data_Tojrnl").val(sourceJournalName);
            sg.controls.Focus($("#btnPrint"));
        }
    }
};

var finderFilter = {

    /**
     * @function
     * @name getFromProfileFilter
     * @description Setup the filter for 'FromProfile' finder
     * @namespace finderFilter
     * @public
     * 
     * @returns {object} The filter object
     */
    getFromProfileFilter: function () {
        let filters = [[]];
        let documentType = $("#Data_Frjrnl").val();
        filters[0][0] = sg.finderHelper.createFilter("SourceJournalName", sg.finderOperator.StartsWith, documentType);

        return filters;
    },

    /**
     * @function
     * @name getToProfileFilter
     * @description Setup the filter for 'ToProfile' finder
     * @namespace finderFilter
     * @public
     *
     * @returns {object} The filter object
     */
    getToProfileFilter: function () {
        let filters = [[]];
        let documentType = $("#Data_Tojrnl").val();
        filters[0][0] = sg.finderHelper.createFilter("SourceJournalName", sg.finderOperator.StartsWith, documentType);

        return filters;
    },
}

var sourceJournalProfileReportOnSuccess = {

    /**
     * @function
     * @name display
     * @description Display the results
     * @namespace sourceJournalProfileReportOnSuccess
     * @public
     *
     * @param {object} result The JSON result payload
     */
    display: function (result) {
        if (result) {
            if (!sourceJournalProfileReportUI.hasKoApplied) {
                sourceJournalProfileReportUI.sourceJournalProfileReportModel = window.ko.mapping.fromJS(result);
                sourceJournalProfileReportKoExtn.sourceJournalProfileReportExtension(sourceJournalProfileReportUI.sourceJournalProfileReportModel);
                ko.applyBindings(sourceJournalProfileReportUI.sourceJournalProfileReportModel);

                sourceJournalProfileReportUI.hasKoApplied = true;
            } else {
                ko.mapping.fromJS(result, sourceJournalProfileReportUI.sourceJournalProfileReportModel);
            }
        }
    },

    /**
     * @function
     * @name executeSourceJournalProfileReport
     * @description Open the report result or display a message
     * @namespace sourceJournalProfileReportOnSuccess
     * @public
     *
     * @param {object} result The JSON result payload
     */
    executeSourceJournalProfileReport: function (result) {
        if (result && result.UserMessage.IsSuccess) {
            sg.utls.openReport(result.ReportToken);
        } else {
            sg.utls.showMessage(result);
        }
    }
};

// Primary page entry point
$(function () {
    sourceJournalProfileReportUI.init();
});