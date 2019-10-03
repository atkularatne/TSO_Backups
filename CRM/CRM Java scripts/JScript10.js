function removeLetterTypes()
{
    var attrControl = Xrm.Page.getControl("wl_letter_type");
    var controlAttributes = attrControl.getAttribute();
    var attrControlText = Xrm.Page.getAttribute("wl_letter_type").getText();

    var removeList = [];
    for (var intCounter = 0; intCounter < controlAttributes.getOptions().length; intCounter++)
    {
        switch (parseInt(controlAttributes.getOptions()[intCounter].value)) {
            case 102730009: // PoL Duplicate
            case 102730012: // PoL Alternative            
                break;
            default:
                removeList.push(parseInt(controlAttributes.getOptions()[intCounter].value));
                break;
        }
    }


    if ((attrControlText != "PoL") && (attrControlText != "PoL Correction") && (attrControlText != "PoL Reminder")) 
    {
        for (var intCounter = 0; intCounter < removeList.length; intCounter++) {
            attrControl.removeOption(removeList[intCounter]);
        }

        for (var intCounter = 0; intCounter < removeList.length; intCounter++) {
            attrControl.removeOption('')
        }
        // remove empty 
        /*attrControl.forEach(function (control) {
            attrControl.removeOption('')
        });*/
    }
    //attrControl.removeOption("102730009");
}

// read policy id
function readPolicyRecord() {
    var attrControl = Xrm.Page.getControl("tsowl_fixedlettertype");
    if (attrControl != null) // disabling the fixed letter type by default 
    {
        Xrm.Page.getControl("tsowl_fixedlettertype").setDisabled(true);
    }

    var policyItem = Xrm.Page.getAttribute("regardingobjectid").getValue();
    var attrControl = Xrm.Page.getControl("tsowl_fixedlettertype");

    if (policyItem != null) {
        var policyName = policyItem[0].name;
        var policyID = policyItem[0].id;
        //alert(policyID);
        policyID = policyID.replace('{', '').replace('}', '');
        Xrm.Page.data.entity.attributes.get("tsowl_policyno").setValue(policyName);
        retrieveRecord(policyName);
    }
    else {
        var chequeId = Xrm.Page.getAttribute("tsowl_cheque_production_id").getValue();
        setpolicyLookup(chequeId);
    }
}

// retrive policy data
function retrieveRecord(policyName) {
    var url = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
    var oDataPath = url + "/xrmservices/2011/organizationdata.svc";
    var filter = "/tsowl_policySet()/?$filter=tsowl_policy_number eq '" + policyName + "' &$select=tsowl_RegardingObjectId,tsowl_BRAND";

    var retrieveRecordsReq = new XMLHttpRequest();

    retrieveRecordsReq.open("GET", oDataPath + filter, true);
    retrieveRecordsReq.setRequestHeader("Accept", "application/json");
    retrieveRecordsReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    retrieveRecordsReq.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var retrievedRecords = JSON.parse(retrieveRecordsReq.responseText).d;
                var regarding_object = retrievedRecords.results[0].tsowl_RegardingObjectId;
                var brandObject = retrievedRecords.results[0].tsowl_BRAND;
                var attrControl = Xrm.Page.getControl("tsowl_fixedlettertype");
                var controlAttributes = attrControl.getAttribute();
                if (brandObject != null && attrControl != null) {
                    try {
                        //Leeds Permanent Building Society || Lloyds TSB ||Bank Of Scotland  ||Halifax 
                        if (brandObject.Value == 736090005 || brandObject.Value == 736090006 || brandObject.Value == 736090002 || brandObject.Value == 736090004) { // LBG Data (only allowing certain fixed letter types) 
                            // all options are valid for LTSB
                            Xrm.Page.getControl("tsowl_fixedlettertype").setDisabled(false);
                        }
                        else if (brandObject.Value == 736090007) { // Sainsbury  (only allowing certain fixed letter types) 
                            var removeList = [];
                            for (var intCounter = 0; intCounter < controlAttributes.getOptions().length; intCounter++) {
                                switch (parseInt(controlAttributes.getOptions()[intCounter].value)) {
                                    case 736090000: // 4 week
                                    case 736090005: // contact made - accept - reportable
                                    case 736090006: // contact made - offer not accepted
                                    case 736090009: // no contact made
                                    case 736090010: // no policy info found
                                    case 736090011: // straddler plus waiver
                                    case 736090001: // waiver
                                        break;
                                    default:
                                        removeList.push(parseInt(controlAttributes.getOptions()[intCounter].value));
                                        break;
                                }
                            }
                            for (var intCounter = 0; intCounter < removeList.length; intCounter++) {
                                attrControl.removeOption(removeList[intCounter]);
                            }

                            Xrm.Page.getControl("tsowl_fixedlettertype").setDisabled(false);
                        }
                        else {
                            var attrControlWordorFixed = Xrm.Page.getControl("tsowl_wordorfixed");
                            if (attrControlWordorFixed != null) {
                                Xrm.Page.getAttribute("tsowl_wordorfixed").setValue(1);
                                Xrm.Page.getControl("tsowl_wordorfixed").setDisabled(true);
                                Xrm.Page.getControl("tsowl_wordlettertype").setDisabled(false);
                                Xrm.Page.getControl("tsowl_wordlettertype").setVisible(true);
                                Xrm.Page.getControl("tsowl_letter_type").setVisible(false);
                                Xrm.Page.getControl("tsowl_fixedlettertype").setVisible(false);
                            }

                        }

                    }
                    catch (e) {
                        alert("an error has occurred");
                    }
                }
                else {
                    var attrControlWordorFixed = Xrm.Page.getControl("tsowl_wordorfixed");
                    if (attrControlWordorFixed != null) {

                        Xrm.Page.getAttribute("tsowl_wordorfixed").setValue(1);
                        Xrm.Page.getControl("tsowl_wordorfixed").setDisabled(true);
                        Xrm.Page.getControl("tsowl_wordlettertype").setDisabled(false);
                        Xrm.Page.getControl("tsowl_wordlettertype").setVisible(true);
                        Xrm.Page.getControl("tsowl_letter_type").setVisible(false);
                        Xrm.Page.getControl("tsowl_fixedlettertype").setVisible(false);
                    }
                }

                setCustomerLookup(regarding_object);
            }
        }
    };
    retrieveRecordsReq.send();
}

// set custoemr lookup field
function setCustomerLookup(regarding_object) {
    /*alert(regarding_object.Id);
    alert(regarding_object.Name);
    alert(regarding_object.LogicalName);*/

    Xrm.Page.data.entity.attributes.get("tsowl_hiddenfield").setValue(hiddenVal);
    var hiddenVal = regarding_object.Id;
    hiddenVal = hiddenVal + ";" + regarding_object.Name.toString();

    Xrm.Page.data.entity.attributes.get("tsowl_hiddenfield").setValue(hiddenVal);

    var lookup = new Array();
    lookup[0] = new Object();

    lookup[0].id = "'" + regarding_object.Id + "'";
    lookup[0].name = regarding_object.Name.toString();
    lookup[0].entityType = 'contact';
    Xrm.Page.getAttribute("tsowl_customer_name").setValue(lookup);
    // DisableLookupLinks("tsowl_customer_name");
}

function DisableLookupLinks(lookupFieldName) {
    var lookupParentNode = document.getElementById(lookupFieldName + "_d");
    var lookupSpanNodes = lookupParentNode.getElementsByTagName("SPAN");

    for (var spanIndex = 0; spanIndex < lookupSpanNodes.length; spanIndex++) {
        var currentSpan = lookupSpanNodes[spanIndex];
        currentSpan.style.textDecoration = "none";
        currentSpan.style.color = "#000000";
        currentSpan.onclick = function () { };
    }
}

// On New Outbound Letter, set this date
function SetCurrentDate() {
    if (Xrm.Page.ui.getFormType() == 1 /* on New*/) {
        Xrm.Page.data.entity.attributes.get("tsowl_date").setValue(new Date());
    }
}


function setpolicyLookup(chequeId) {
    if (chequeId != null) {
        var policyGUID = null;
        var lookup = new Array();
        lookup[0] = new Object();

        var policyName = Xrm.Page.getAttribute("tsowl_policyno").getValue();
        var url = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
        var oDataPath = url + "/xrmservices/2011/organizationdata.svc";

        var filter = "/tsowl_policySet()/?$filter=tsowl_policy_number eq '" + policyName + "' &$select=tsowl_policyId";

        var retrieveRecordsReq = new XMLHttpRequest();

        retrieveRecordsReq.open("GET", oDataPath + filter, true);
        retrieveRecordsReq.setRequestHeader("Accept", "application/json");
        retrieveRecordsReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        retrieveRecordsReq.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var retrievedRecords = JSON.parse(retrieveRecordsReq.responseText).d;
                    lookup[0].id = retrievedRecords.results[0].tsowl_policyId;
                    //Xrm.Page.getAttribute("tsowl_policyid").setValue(retrievedRecords.results[0].tsowl_policyId);
                    lookup[0].name = policyName.toString();
                    lookup[0].entityType = 'tsowl_policy';
                    Xrm.Page.getAttribute("regardingobjectid").setValue(lookup);
                    Xrm.Page.data.entity.save();
                }
            }
        };

        retrieveRecordsReq.send();

    }
}
