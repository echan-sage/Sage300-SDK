// The MIT License (MIT) 
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

//@ts-check

"use strict";

// Ajax call to controller
var sourceJournalAjax = {
    /**
     * @function
     * @name call
     * @description Invoke Ajax post
     * @namespace sourceJournalAjax
     * @public 
     * 
     * @param {string} method The name of the method to invoke
     * @param {object} data The data payload object
     * @param {Function} successMethod The callback function to invoke on successful Ajax post
     */
    call: function (method, data, successMethod) {
        var url = sg.utls.url.buildUrl("TU", "SourceJournalProfile", method);
        sg.utls.ajaxPost(url, data, successMethod);
    },

    /**
     * @function
     * @name callHtml
     * @description Invoke Ajax post
     * @namespace sourceJournalAjax
     * @public
     *
     * @param {string} method The name of the method to invoke
     * @param {object} data The data payload object
     * @param {Function} successMethod The callback function to invoke on successful Ajax post
     */
    callHtml: function (method, data, successMethod) {
        var url = sg.utls.url.buildUrl("TU", "SourceJournalProfile", method);
        sg.utls.ajaxPostHtml(url, data, successMethod);
    },

    /**
     * @function
     * @name syncCall
     * @description Invoke Ajax post
     * @namespace sourceJournalAjax
     * @public
     *
     * @param {string} method The name of the method to invoke
     * @param {object} data The data payload object
     * @param {Function} successMethod The callback function to invoke on successful Ajax post
     */
    syncCall: function (method, data, successMethod) {
        var url = sg.utls.url.buildUrl("TU", "SourceJournalProfile", method);
        sg.utls.ajaxPostSync(url, data, successMethod);
    },
};

var sourceJournalRepository = {

    /**
     * @function
     * @name get
     * @description Invoke the server-side 'Get' method
     * @namespace sourceJournalRepository
     * @public
     *
     * @param {string} sourceJournalProfile The Source Journal Profile specifier
     */
    get: function (sourceJournalProfile) {
        var data = { id: sourceJournalProfile };
        sourceJournalAjax.syncCall("Get", data, sourceJournalProfileUISuccess.get);
    },

    /**
     * @function
     * @name create
     * @description Invoke the server-side 'Create' method 
     * @namespace sourceJournalRepository
     * @public
     */
    create: function () {
        var data = {};
        sourceJournalAjax.call("Create", data, sourceJournalProfileUISuccess.create);
    },

    /**
     * @function
     * @name deleteSourceJournal
     * @description Invoke the server-side 'Delete' method
     * @namespace sourceJournalRepository
     * @public
     *
     * @param {string} sourceJournalProfile The Source Journal Profile specifier
     */
    deleteSourceJournal: function (sourceJournalProfile) {
        var data = { 'id': sourceJournalProfile };
        sourceJournalAjax.call("Delete", data, sourceJournalProfileUISuccess.deleteSourceJournal);
    },

    /**
     * @function
     * @name saveSourceJournal
     * @description Invoke the server-side 'Save' method
     * @namespace sourceJournalRepository
     * @public
     *
     * @param {object} model The Source Journal Profile model data object
     */
    saveSourceJournal: function (model) {
        var data = { 'model': ko.mapping.toJS(model) };
        sourceJournalAjax.call("Save", data, sourceJournalProfileUISuccess.update);
    },

    // Additional methods go here

    /**
     * @function
     * @name getSourceCodeById
     * @description Invoke the server-side 'GetSourceCodeById' method
     * @namespace sourceJournalRepository
     * @public
     *
     * @param {string} sourceLedger The Source Ledger specifier
     * @param {string} sourceType The Source Type specifier
     */
    getSourceCodeById: function (sourceLedger, sourceType) {
        var data = {
            'sourceLedger': sourceLedger,
            'sourceType': sourceType,
        };
        sourceJournalAjax.call("GetSourceCodeById", data, sourceJournalProfileUISuccess.sourceCodeSuccess);
    },

    /**
     * @function
     * @name isExist
     * @description Invoke the server-side 'IsExist' method
     * @namespace sourceJournalRepository
     * @public
     *
     * @param {string} source The Source specifier
     * @param {string} sourceType The Source Journal name specifier
     */
    isExist: function (source, sourceJournalName) {
        var data = {
            source: source,
            sourceJournalName: sourceJournalName
        };
        sourceJournalAjax.call("IsExist", data, sourceJournalProfileUISuccess.isExistSuccess);
    },
};