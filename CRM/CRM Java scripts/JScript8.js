function showCategories() 
{
    var documentType = Xrm.Page.getAttribute("wl_documenttype").getText();
    if (documentType == "Individual Mailings") {
        Xrm.Page.getControl("wl_categories").setVisible(true);
        Xrm.Page.getAttribute("wl_categories").setRequiredLevel("required");
    }
    else {
        Xrm.Page.getControl("wl_categories").setVisible(false);
        Xrm.Page.getAttribute("wl_categories").setRequiredLevel("none");
    }
}

function openNewOutboundLetter() {

    var beneFieldValue = Xrm.Page.getAttribute("regardingobjectid").getValue();

    var beneName = beneFieldValue[0].name;
    var beneID = beneFieldValue[0].id;
    beneID = beneID.replace('{', '').replace('}', '');

    var parameters = {};
    parameters["wl_hiddenbeneguid"] = beneID + "," + beneName;

    var windowOptions = {
        openInNewWindow: true
    };

    Xrm.Utility.openEntityForm("letter", null, parameters, windowOptions);
}

function openBeneficiaryRecord() {
    var beneFieldValue = Xrm.Page.getAttribute("regardingobjectid").getValue();

    var parameters = {};
    parameters["formid"] = "8c9a6ccf-4a4c-48c5-ae14-d31207eb76a6";

    var windowOptions = {
        openInNewWindow: true
    };

    Xrm.Utility.openEntityForm("contact", beneFieldValue, parameters, windowOptions);
}

function addBeneficiaryLink() {
    addLinkAtTop("regardingobjectid", "tab_2_section_bene", "openBene()", -1);

}

function addBeneficiaryLinkAgain() {
    addLinkAtTop("regardingobjectid", "tab_2_section_bene", "openBene()", 2);

}

function addCampaignResponseLink() {
    addLinkAtTop("wl_campaignresponseid", "tab_2_section_campaignresponse", "openCampaignResponse()", -1);
}

function addLinkAtTop(fieldName, sectionName, jsOpenFunctionName, deleteIndex) {
    var item = Xrm.Page.getAttribute(fieldName).getValue();
    if (item != null) {

        var itemName = item[0].name;

        var div = document.createElement("div");
        div.style.width = "19%";
        div.style.textAlign = "right";
        div.style.display = "inline";

        var selectList = '<table><tr><td width="50%" align="left"><a href="javascript:' + jsOpenFunctionName + '" style="color:#0000ff;font-weight:bold;text-decoration:underline">' + itemName + '</a></td></tr></table>';

        div.innerHTML = selectList;

        var elementsTable = document.getElementsByName(sectionName);
        var elementTable = elementsTable[0];

        if (deleteIndex > 0)
            elementTable.deleteRow(deleteIndex);

        var newRow = elementTable.insertRow(2);
        var newCell = newRow.insertCell(0);

        newCell.appendChild(div);
    }
}


function openBene() {

    var beneItem = Xrm.Page.getAttribute("regardingobjectid").getValue();
    if (beneItem != null) {
        var beneID = beneItem[0].id;
        OpenRecords(beneID, "contact", "extraqs=formid%3d8c9a6ccf-4a4c-48c5-ae14-d31207eb76a6&");
    }
}

function openCampaignResponse() {

    var campaignResponseItem = Xrm.Page.getAttribute("wl_campaignresponseid").getValue();
    if (campaignResponseItem != null) {
        var campaignResponseID = campaignResponseItem[0].id;
        OpenRecords(campaignResponseID, "campaignresponse", "");
    }
}

function OpenRecords(Record_Id, Logical_Name_Of_Entity, Extras) {

    var reletivePath = "/main.aspx?etn=" + Logical_Name_Of_Entity;
    reletivePath = reletivePath + "&" + Extras + "pagetype=entityrecord&id=";

    //reletivePath = "/main.aspx?etc=2&" + Extras + "pagetype=entityrecord&id=";


    var height = 500; // Height of the Record Page.
    var width = 600; // Width of the Record Page.
    var windowName = "_blank";
    var serverUrl = Xrm.Page.context.getClientUrl();
    var nAgt = navigator.userAgent;

    if (serverUrl != null && serverUrl != ""
                      &&
        Record_Id.replace("{", "").replace("}", "") != null) {
        serverUrl = serverUrl + reletivePath;
        serverUrl = serverUrl + Record_Id.replace("{", "").replace("}", "");

        //alert(serverUrl);

        /*        if (nAgt.indexOf("Firefox") != -1) {
        window.open(serverUrl);
        } else {*/
        openStdWin(serverUrl,
                       null,
                       height,
                       width,
                       "titlebar=yes, resizable=yes");
        /*}*/
    }
}

// This function calling from "Pol complete" ribbon button display rule
function hidePolCompleteButton() {

    var documentType = Xrm.Page.getAttribute("wl_documenttype").getText();
    var recordId = Xrm.Page.data.entity.getId();

    var fetchXmlFindCampaingResponse = "<fetch distinct='true' mapping='logical' output-format='xml-platform' version='1.0' >" +
                                        "<entity name='campaignresponse' >" +
                                        "<attribute name='activityid' />" +
                                        "<attribute name='wl_polstatus' />" +
                                        "<order descending='false' attribute='subject' />" +
                                        "<link-entity name='fax' alias='ab' to='activityid' from='wl_campaignresponseid' >" +
                                        "<filter type='and' >" +
                                        "<condition attribute='activityid' value='" + recordId + "' operator='eq' />" + //inbound record id
                                        "</filter>" +
                                        "</link-entity>" +
                                        "</entity>" +
                                        "</fetch>";


    var campaingnResponse = CrmFetchKit.FetchSync(fetchXmlFindCampaingResponse);
    var pol_status = campaingnResponse[0].attributes.wl_polstatus.value;

    //102730000 -Under Validation
    if ((documentType == "PoL") && (pol_status == "102730000")) {
        return true;
    }
    else {
        return false;
    }
}

// hide Pol Correction ribbon button
function hidePolCorrectionRibbonButton1() {

    alert("hidePolCorrectionRibbonButton");

    var documentType = Xrm.Page.getAttribute("wl_documenttype").getText();
    var recordId = Xrm.Page.data.entity.getId();

    // find records with pol correction created date not recorded
    /* var fetchXmlFindCampaingResponse = "<fetch distinct='true' mapping='logical' output-format='xml-platform' version='1.0' >" +
    "<entity name='campaignresponse' >" +
    "<attribute name='activityid' />" +
    "<attribute name='wl_polcorrectioncreatedon' />" +
    "<order descending='false' attribute='subject' />" +                                        
    "<filter type='and' >" +
    "<condition attribute='wl_polcorrectioncreatedon' operator='not-null' />" +
    "</filter>" +
    "<link-entity name='fax' alias='ab' to='activityid' from='wl_campaignresponseid' >" +
    "<filter type='and' >" +
    "<condition attribute='activityid' value='" + recordId + "' operator='eq' />" + //inbound record id
    "</filter>" +
    "</link-entity>" +
    "</entity>" +
    "</fetch>";

    
    var campaingnResponse = CrmFetchKit.FetchSync(fetchXmlFindCampaingResponse);*/

    //  if ((campaingnResponse.length == 0) && (documentType == "PoL")) {
    if (documentType == "PoL") {
        return true; // display Pol correction button
    }
    else {
        return false;
    }
}

function hidePolCorrectionRibbonButton() {

    // alert("hidePolCorrectionRibbonButton1");
    return true; // display Pol correction button

}