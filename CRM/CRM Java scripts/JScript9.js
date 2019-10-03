// JScript source code
general_section_external_counsel

// show hide section base on case type
function showHideSections() {
    var caseType = Xrm.Page.getAttribute("subjectid").getValue();
    var customerSupplier = Xrm.Page.getAttribute("ls_customersupplier").getText();

    if (caseType != null) {
        var caseName = caseType[0].name;

        hideSecctions();

        switch (caseName) {
            case "Contracts":
                {
                    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section1").setVisible(true);

                    if (customerSupplier == "Customer") {
                        Xrm.Page.ui.tabs.get("general").sections.get("Case_Section2").setVisible(true);
                    }
                    else if (customerSupplier == "Supplier") {
                        Xrm.Page.ui.tabs.get("general").sections.get("Case_Section3").setVisible(true);
                    }
                    else if (customerSupplier == "Other") {
                        Xrm.Page.ui.tabs.get("general").sections.get("Case_Section4").setVisible(true);
                    }
                    break;
                }
            case "Employment":
                Xrm.Page.ui.tabs.get("general").sections.get("general_section_note").setVisible(true);
                break;
            case "M&A":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section5").setVisible(true);
                Xrm.Page.ui.tabs.get("general").sections.get("general_section_currency").setVisible(true);
                break;
            case "Compliance":
            case "Public Affairs":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section6").setVisible(true);
                break;
            case "Business advice":
            case "Special Projects":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section7").setVisible(true);
                break;
            case "Corporate Matters":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section20").setVisible(true);
                break;
            case "Litigation":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section8").setVisible(true);
                Xrm.Page.ui.tabs.get("general").sections.get("general_section_currency").setVisible(true);
                setLitReasonDefaultValue();
                break;

            case "BPO Matters":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section9").setVisible(true);
                break;
            case "Other":
                Xrm.Page.ui.tabs.get("general").sections.get("Case_Section21").setVisible(true);
                break;
            default:
                break;
        }
    }
}

function hideSecctions() {
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section1").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section2").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section3").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section4").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section5").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section6").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section7").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section8").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section9").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section20").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("Case_Section21").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("general_section_note").setVisible(false);
    Xrm.Page.ui.tabs.get("general").sections.get("general_section_currency").setVisible(false);
}
function customerSupplierOnChange() {
    var customerSupplier = Xrm.Page.getAttribute("ls_customersupplier").getText();

    if (customerSupplier != null) {
        if (customerSupplier == "Customer") {
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section3").setVisible(false);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section2").setVisible(true);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section4").setVisible(false);
            //Xrm.Page.ui.tabs.get("general").sections.get("general_section_note").setVisible(true);
        }
        else if (customerSupplier == "Supplier") {
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section2").setVisible(false);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section3").setVisible(true);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section4").setVisible(false);
            //Xrm.Page.ui.tabs.get("general").sections.get("general_section_note").setVisible(true);
        }
        else if (customerSupplier == "Other") {
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section3").setVisible(false);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section2").setVisible(false);
            Xrm.Page.ui.tabs.get("general").sections.get("Case_Section4").setVisible(true);
        }
    }
}


function removeReportExternalLookupValues() {
    // clear reporting unit and external council based on courty value change
    Xrm.Page.getAttribute("ls_reportingunitid").setValue(null);
    Xrm.Page.getAttribute("ls_reportingunitid").setSubmitMode("always");
    Xrm.Page.getAttribute("ls_externalcounselid").setValue(null);
    Xrm.Page.getAttribute("ls_externalcounselid").setSubmitMode("always");
}

// retrive region data based on country
function retrieveRegionRecord() {
    var countryObject = Xrm.Page.getAttribute("ls_countryid").getValue();

    if (countryObject != null) {
        var countryID = countryObject[0].id;
        countryID = countryID.replace('{', '').replace('}', '');

        //var url = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
        // var url = "https://wlcrm.crm4.dynamics.com";
        var url = document.location.protocol + "//" + document.location.host;

        var oDataPath = url + "/xrmservices/2011/organizationdata.svc";

        //var filter = "/ls_countrySet(guid'" + countryID + "')?$select=ls_region";
        var filter = "/ls_countrySet(guid'" + countryID + "')?$select=ls_region,ls_cluster";
        var retrieveRecordsReq = new XMLHttpRequest();

        retrieveRecordsReq.open("GET", oDataPath + filter, false);
        retrieveRecordsReq.setRequestHeader("Accept", "application/json");
        retrieveRecordsReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        retrieveRecordsReq.send(null);
        var retrievedRecord = JSON.parse(retrieveRecordsReq.responseText).d;

        if (retrievedRecord.ls_region != null) {
            SetOptionSetValue("ls_regionid", retrievedRecord.ls_region)
        }

        if (retrievedRecord.ls_cluster != null) {
            SetOptionSetValue("ls_cluster", retrievedRecord.ls_cluster)
        }
    }
    else {
        Xrm.Page.getAttribute("ls_cluster").setValue(null);
        Xrm.Page.getAttribute("ls_regionid").setValue(null);
    }
}

function SetOptionSetValue(optionsetAttribute, optionText) {
    var options = Xrm.Page.getAttribute(optionsetAttribute).getOptions();
    for (i = 0; i < options.length; i++) {
        if (options[i].text == optionText)
            Xrm.Page.getAttribute(optionsetAttribute).setValue(options[i].value);
    }
}

// retrive country based on user entity country field
function retrieveUserCountry() {
    var createdbyObject = Xrm.Page.getAttribute("createdby").getValue();

    var lookup = new Array();
    lookup[0] = new Object();

    if (createdbyObject != null) {
        var createdId = createdbyObject[0].id;
        createdId = createdId.replace('{', '').replace('}', '');

        var url = document.location.protocol + "//" + document.location.host;

        var oDataPath = url + "/xrmservices/2011/organizationdata.svc";

        var filter = "/SystemUserSet(guid'" + createdId + "')?$select=ls_unitID";
        var retrieveRecordsReq = new XMLHttpRequest();

        retrieveRecordsReq.open("GET", oDataPath + filter, false);
        retrieveRecordsReq.setRequestHeader("Accept", "application/json");
        retrieveRecordsReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        retrieveRecordsReq.send(null);
        var retrievedRecord = JSON.parse(retrieveRecordsReq.responseText).d;


        var countryObject = Xrm.Page.getAttribute("ls_countryid").getValue();
        if (countryObject == null) {
            if (retrievedRecord.ls_unitID.Name != null) {
                lookup[0].id = retrievedRecord.ls_unitID.Id;
                lookup[0].name = retrievedRecord.ls_unitID.Name;
                lookup[0].entityType = 'ls_country';
                Xrm.Page.getAttribute("ls_countryid").setValue(lookup);
            }
        }

    }
}

// Filter Reporting Unit entity fields based on country and Business unit
function preFilterReportingEntityLookup() {
    // get case guid
    var caseId = Xrm.Page.data.entity.getId();
    var formType = Xrm.Page.ui.getFormType();

    if (Xrm.Page.ui.getFormType() != 1) {
        Xrm.Page.getControl("ls_reportingunitid").addPreSearch(function () {

            // find business units in grid control
            //var fetchXmlFindBusinessUnits = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'><entity name='connection'><attribute name='record2id' /><attribute name='record2roleid' /><attribute name='connectionid' /><order attribute='record2id' descending='false' /><filter type='and'>" +
            //                            "<condition attribute='record1id' operator='eq' uitype='incident' value='" + caseId + "' />" + "</filter></entity></fetch>";

            var fetchXmlFindBusinessUnits = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                                            "<entity name='connection'>" +
                                            "<attribute name='record2id' /><attribute name='record2roleid' />" +
                                            "<attribute name='connectionid' /><order attribute='record2id' descending='false' />" +
                                            "<filter type='and'>" +
                                            "<condition attribute='record1id' operator='eq' uitype='incident' value='" + caseId + "' />" +
                                            "<condition attribute='statecode' operator='eq' value='0' />" +
                                            "</filter></entity></fetch>";

            //alert(fetchXmlFindBusinessUnits);                
            var countryObject = Xrm.Page.getAttribute("ls_countryid").getValue();

            if (countryObject != null) {
                var countryTextValue = countryObject[0].name;
                var countryID = countryObject[0].id;

                fetchXml = "<filter type='and'>" +
               "<condition attribute='ls_countryid' operator='eq' uiname='" + countryTextValue + "' uitype='ls_country' value='" + countryID + "' />"

                // find business units in grid control
                var businessUnits = CrmFetchKit.FetchSync(fetchXmlFindBusinessUnits);
                if (businessUnits.length >= 1) {
                    fetchXml += "<condition attribute='ls_dpdbuid' operator='in'>"
                    for (var i = 0, len = businessUnits.length; i < len; i++) {
                        //var businessUnitId = businessUnits[i].Id;
                        var businessUnitId = businessUnits[i].attributes.record2id.guid;    // get Business unit id
                        //fetchXml += "<condition attribute='ls_dpdbuid' operator='eq' uitype='account' value='" + businessUnitId + "' />"
                        fetchXml += "<value uitype='account'>" + businessUnitId + "</value>"
                    }

                    //fetchXml += "</condition></filter>";
                    fetchXml += "</condition>";
                }

                fetchXml += "</filter>";
                Xrm.Page.getControl("ls_reportingunitid").addCustomFilter(fetchXml);
            }
        });
    }
}

// set dummy values to this system field
function setLookupDummyValue() {

    var lookup = new Array();
    lookup[0] = new Object();

    // find business units
    var fetchXmlFindBusinessUnits = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' ><entity name='account'><attribute name='name'/><attribute name='primarycontactid'/><order descending='false' attribute='name' /></entity></fetch>";

    var businessUnits = CrmFetchKit.FetchSync(fetchXmlFindBusinessUnits);

    if (businessUnits.length >= 1) {
        var businessUnitName = businessUnits[0].attributes.name.value;
        var businessUnitId = businessUnits[0].attributes.accountid.value;     // get Business unit id

        /*lookup[0].id = "37DBC023-AD92-E511-8130-C4346BAD1068";
        lookup[0].name = "Other";*/

        lookup[0].id = businessUnitId;
        lookup[0].name = businessUnitName;
        lookup[0].entityType = 'account';

        // this feild hidden in form and set dummy value 
        Xrm.Page.getAttribute("customerid").setValue(lookup);
    }
    else {
        alert("Business Units not found");
    }
}

function setLitReasonDefaultValue() {
    var lookup = new Array();
    lookup[0] = new Object();

    // find litigation reason
    var fetchXmlFindLitigationReason = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
    "<entity name='ls_litreason'><attribute name='ls_litreasonid'/><attribute name='ls_name' /><order attribute='ls_name' descending='false'/>" +
    "<filter type='and' ><condition attribute='ls_name' operator='eq' value='Individual case' /></filter></entity></fetch>";

    var litigationReason = CrmFetchKit.FetchSync(fetchXmlFindLitigationReason);

    if (Xrm.Page.ui.getFormType() == 1 /* on New*/) {
        if (litigationReason.length >= 1) {
            //lookup[0].id = "E9C0367E-A692-E511-8130-C4346BAD1068";
            //lookup[0].name = "Individual Case";

            lookup[0].id = litigationReason[0].attributes.ls_litreasonid.value;
            lookup[0].name = litigationReason[0].attributes.ls_name.value;
            lookup[0].entityType = 'ls_litreason';

            // set lit reason default value
            Xrm.Page.getAttribute("ls_litreason").setValue(lookup);
        }
        else {
            alert("Litigation Reason not found");
        }
    }
}


function setStartingDate() {
    var courtStatus = Xrm.Page.getAttribute("ls_courtstatus").getText();
    if (courtStatus == "Court") {
        Xrm.Page.data.entity.attributes.get("ls_litstartdate").setValue(new Date());
    }
}
function SetLastUpdatedDate() {
    Xrm.Page.data.entity.attributes.get("ls_lastupdated").setValue(new Date());
}
function SetIsConfidential() {
    var caseType = Xrm.Page.getAttribute("subjectid").getValue();

    if (caseType != null) {
        var caseName = caseType[0].name;
        if (caseName == "Employment" || caseName == "M&A" || caseName == "Compliance" || caseName == "Corporate Matters" || caseName == "BPO Matters") {
            SetOptionSetValue("ls_confidential", "Yes");
        }
        else {
            SetOptionSetValue("ls_confidential", "No");
        }
    }
}
function showCountryRegion() {
    if (Xrm.Page.ui.getFormType() != 1 /* on New*/) {
        // visible country and region fields
        Xrm.Page.getControl("ls_countryid").setVisible(true);
        Xrm.Page.getControl("ls_regionid").setVisible(true);
        Xrm.Page.getControl("ls_cluster").setVisible(true);
        Xrm.Page.getControl("ls_reportingunitid").setVisible(true);
        Xrm.Page.getControl("ls_externalcounselid").setVisible(true);

        Xrm.Page.getAttribute("ls_countryid").setRequiredLevel("required");
        Xrm.Page.getAttribute("ls_regionid").setRequiredLevel("required");

        retrieveUserCountry();
        retrieveRegionRecord();
        preFilterReportingEntityLookup();
    }
}

// Business unit required field validation
function businessUnitValidation(ExecutionObj) {
    // get case guid
    var caseId = Xrm.Page.data.entity.getId();

    if (Xrm.Page.ui.getFormType() != 1) {

        var fetchXmlFindBusinessUnits = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                                            "<entity name='connection'>" +
                                            "<attribute name='record2id' /><attribute name='record2roleid' />" +
                                            "<attribute name='connectionid' /><order attribute='record2id' descending='false' />" +
                                            "<filter type='and'>" +
                                            "<condition attribute='record1id' operator='eq' uitype='incident' value='" + caseId + "' />" +
                                            "<condition attribute='statecode' operator='eq' value='0' />" +
                                            "</filter></entity></fetch>";

        var businessUnits = CrmFetchKit.FetchSync(fetchXmlFindBusinessUnits);
        if (businessUnits.length <= 0) {
            alert("Please select DHL Business units");
            // stop saving 
            ExecutionObj.getEventArgs().preventDefault();
        }
    }
}

function showActiveCounselInvoices() {
    var externalCounsel = Xrm.Page.getAttribute("ls_externalcounselid").getValue();
    if (externalCounsel != null) {
        Xrm.Page.ui.tabs.get("general").sections.get("general_section_external_counsel").setVisible(true);
    }
    else {
        Xrm.Page.ui.tabs.get("general").sections.get("general_section_external_counsel").setVisible(false);
    }
}


