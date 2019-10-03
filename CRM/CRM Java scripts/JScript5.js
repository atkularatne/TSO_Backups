function addRelatedRecordLink() {
    addBankLink();
    addPensionGuardianLink();
    addPaymentmetadataLink();
}

function addBankLink() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedBank = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                            "<entity name='wl_bank' >" +
                                "<attribute name='wl_bankid' />" +
                                "<attribute name='wl_name' />" +
                                "<attribute name='wl_pensionnumber' />" +
                                "<order descending='false' attribute='wl_name' />" +
                                "<link-entity name='account' alias='ae' to='wl_pensionid' from='accountid' >" +
                                    "<filter type='and' >" +
                                       "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                    "</filter>" +
                                "</link-entity>" +
                            "</entity>" +
                        "</fetch>";

    var relatedBank = CrmFetchKit.FetchSync(fetchXmlFindRelatedBank);

    if (relatedBank.length >= 1) {
        addLinkAtTop("tab_bank_section", "openBankRecord()", -1, "Bank");
    }
    else {
        addLinkAtTop("tab_bank_section", "openBankRecord()", -1, "");
    }
}

function addPensionGuardianLink() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedPensionGuardian = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                                            "<entity name='lead' >" +
                                                "<attribute name='fullname' />" +
                                               "<attribute name='leadid' />" +
                                                "<order descending='false' attribute='fullname' />" +
                                                "<filter type='and' >" +
                                                    "<condition attribute='statecode' value='0' operator='eq' />" +
                                                "</filter>" +
                                                "<link-entity name='account' alias='af' to='wl_pensionid' from='accountid' >" +
                                                    "<filter type='and' >" +
                                                        "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                                    "</filter>" +
                                                "</link-entity>" +
                                            "</entity>" +
                                        "</fetch>";

    var relatedPensionGuardian = CrmFetchKit.FetchSync(fetchXmlFindRelatedPensionGuardian);

    if (relatedPensionGuardian.length >= 1) {
        var guardianName = relatedPensionGuardian[0].attributes.fullname.value;
        addLinkAtTop("tab_guardian_section", "openPensionGuardianRecord()", -1, guardianName);
    }
    else {
        addLinkAtTop("tab_guardian_section", "openPensionGuardianRecord()", -1, "");
    }
}

function addPaymentmetadataLink() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedPayment = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                                    "<entity name='wl_paymentmetadata' >" +
                                    "<attribute name='wl_paymentmetadataid' />" +
                                    "<attribute name='wl_name' />" +
                                    "<order descending='false' attribute='wl_name' />" +
                                    "<filter type='and' >" +
                                    "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                    "</filter>" +
                                    "</entity>" +
                                    "</fetch>";


    var relatedPayments = CrmFetchKit.FetchSync(fetchXmlFindRelatedPayment);

    if (relatedPayments.length >= 1) {
        //var paymentName = relatedPayments[0].attributes.inpswl_name.value;
        addLinkAtTop("tab_payment_metadata_section", "openPaymentRecord()", -1, "Payment metadata");
    }
    else {
        addLinkAtTop("tab_payment_metadata_section", "openPaymentRecord()", -1, "");
    }
}


function openPaymentRecord() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedPayment = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                                    "<entity name='wl_paymentmetadata' >" +
                                        "<attribute name='wl_paymentmetadataid' />" +
                                        "<attribute name='wl_name' />" +
                                        "<order descending='false' attribute='wl_name' />" +
                                        "<filter type='and' >" +
                                            "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                        "</filter>" +
                                    "</entity>" +
                                "</fetch>";


    var relatedPayments = CrmFetchKit.FetchSync(fetchXmlFindRelatedPayment);

    var paymentGuid;

    if (relatedPayments.length >= 1) {
        paymentGuid = relatedPayments[0].attributes.wl_paymentmetadataid.value;
        OpenRecords(paymentGuid, "wl_paymentmetadata", "");
    }
}


function openPensionGuardianRecord() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedPensionGuardian = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                                            "<entity name='lead' >" +
                                                "<attribute name='fullname' />" +
                                               "<attribute name='leadid' />" +
                                                "<order descending='false' attribute='fullname' />" +
                                                "<filter type='and' >" +
                                                    "<condition attribute='statecode' value='0' operator='eq' />" +
                                                "</filter>" +
                                                "<link-entity name='account' alias='af' to='wl_pensionid' from='accountid' >" +
                                                    "<filter type='and' >" +
                                                        "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                                    "</filter>" +
                                                "</link-entity>" +
                                            "</entity>" +
                                        "</fetch>";

    var relatedPensionGuardian = CrmFetchKit.FetchSync(fetchXmlFindRelatedPensionGuardian);
    var guardianGuid;

    if (relatedPensionGuardian.length >= 1) {
        guardianGuid = relatedPensionGuardian[0].attributes.leadid.value;
        OpenRecords(guardianGuid, "lead", "");
    }
}

function openBankRecord() {
    var pensionNumber = Xrm.Page.getAttribute("wl_pensionnumber").getValue();

    var fetchXmlFindRelatedBank = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' >" +
                            "<entity name='wl_bank' >" +
                                "<attribute name='wl_bankid' />" +
                                "<attribute name='wl_name' />" +
                                "<attribute name='wl_pensionnumber' />" +
                                "<order descending='false' attribute='wl_name' />" +
                                "<link-entity name='account' alias='ae' to='wl_pensionid' from='accountid' >" +
                                    "<filter type='and' >" +
                                        "<condition attribute='wl_pensionnumber' value='" + pensionNumber + "' operator='eq' />" +
                                    "</filter>" +
                                "</link-entity>" +
                            "</entity>" +
                        "</fetch>";

    var relatedBank = CrmFetchKit.FetchSync(fetchXmlFindRelatedBank);
    if (relatedBank != null) {
        bankGuid = relatedBank[0].attributes.wl_bankid.value;
        OpenRecords(bankGuid, "wl_bank", "");
    }
}

//----------------------Common functions-------------------------------
function addLinkAtTop(sectionName, jsOpenFunctionName, deleteIndex, recordType) {

    var div = document.createElement("div");
    div.style.width = "19%";
    div.style.textAlign = "right";
    div.style.display = "inline";

    var selectList;
    if (recordType != "")
        selectList = '<table><tr><td width="50%" align="left"><a href="javascript:' + jsOpenFunctionName + '" style="color:#0000ff;font-weight:bold;text-decoration:underline">' + recordType + '</a></td></tr></table>';
    else
        selectList = '<table><tr><td width="50%" align="left">Records not found.</td></tr></table>';


    div.innerHTML = selectList;

    var elementsTable = document.getElementsByName(sectionName);
    var elementTable = elementsTable[0];

    if (deleteIndex > 0)
        elementTable.deleteRow(deleteIndex);

    var newRow = elementTable.insertRow(2);
    var newCell = newRow.insertCell(0);

    newCell.appendChild(div);
}


function OpenRecords(Record_Id, Logical_Name_Of_Entity, Extras) {

    var reletivePath = "/main.aspx?etn=" + Logical_Name_Of_Entity;
    //var reletivePath = "/main.aspx?etc=10016"; // cash payment
    reletivePath = reletivePath + "&" + Extras + "pagetype=entityrecord&id=";

    var height = 600; // Height of the Record Page.
    var width = 800; // Width of the Record Page.
    var windowName = "_blank";
    var serverUrl = Xrm.Page.context.getClientUrl();
    var nAgt = navigator.userAgent;

    //if (serverUrl != null && serverUrl != "") {
    if (serverUrl != null && serverUrl != ""
                      &&
        Record_Id.replace("{", "").replace("}", "") != null) {

        serverUrl = serverUrl + reletivePath;
        serverUrl = serverUrl + Record_Id

        openStdWin(serverUrl,
                       null,
                       height,
                       width,
                       "titlebar=yes, resizable=yes");
    }
}

