// set Waiver date in form load
function InitValues() {
    if (Xrm.Page.getAttribute("tsowl_complaint_waiver_date").getValue() != null)
        InitValues.WAIVER_DATE = Xrm.Page.getAttribute("tsowl_complaint_waiver_date").getValue();
    else InitValues.WAIVER_DATE = "";

    if (Xrm.Page.getAttribute("tsowl_complaint_waiver").getValue() != null)
        InitValues.WAIVER = Xrm.Page.getAttribute("tsowl_complaint_waiver").getValue();
    else InitValues.WAIVER = "";

    if (Xrm.Page.getAttribute("tsowl_suspend_mailing").getValue() != null)
        InitValues.SUSPEND_MAILING_FIELD = Xrm.Page.getAttribute("tsowl_suspend_mailing").getValue();
    else InitValues.SUSPEND_MAILING_FIELD = "";

    if (Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue() != null)
        InitValues.CLAIM_DECISION_CARD_FIELD = Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue();
    else InitValues.CLAIM_DECISION_CARD_FIELD = "NULL";

    if (Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card").getValue() != null)
        InitValues.REASSESSED_DECISION_CARD_FIELD = Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card").getValue();
    else InitValues.REASSESSED_DECISION_CARD_FIELD = "";

    if (Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").getValue() != null) InitValues.CLAIM_DEC_CARD_PROCESS = Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").getValue();
    else InitValues.CLAIM_DEC_CARD_PROCESS = "";
    // End of onload code
}

// set Compliaint Waiver Date on change
function setCompliantWaiverDate() {
    var complaintWaiverText = Xrm.Page.getAttribute("tsowl_complaint_waiver").getText();
    // Complaint Waiver ==Yes
    if (complaintWaiverText == 'Yes' || complaintWaiverText == 'Yes - AI' || complaintWaiverText == 'Yes - BP') {
        if (InitValues.WAIVER_DATE == "") {
            Xrm.Page.data.entity.attributes.get("tsowl_complaint_waiver_date").setValue(new Date());
        }
        else {
            Xrm.Page.data.entity.attributes.get("tsowl_complaint_waiver_date").setValue(InitValues.WAIVER_DATE);
        }
    }
    else {
        Xrm.Page.data.entity.attributes.get("tsowl_complaint_waiver_date").setValue(null);
    }
}

// set Compliaint Waiver Date on change
function setCompliantWaiverOnLoad() {
    if (InitValues.WAIVER == '736090000') {
        Xrm.Page.data.entity.attributes.get("tsowl_complaint_waiver").setValue('736090000');
    }
}


function isNumeric(num) {
    return !isNaN(num)
}

// regarding object filed validation
function customerPersonalAssessedFieldValidation() {
    var personalAssessedValue = Xrm.Page.getAttribute("tsowl_personal_assessed_value").getValue();
    if (personalAssessedValue != null && personalAssessedValue != "") {
        if (!isNumeric(personalAssessedValue)) {
            alert("You must enter a number between 0.00 and 100000000.00");
            Xrm.Page.getControl("tsowl_personal_assessed_value").setFocus(true);
            // stop saving 
            event.returnValue = false;
        }
    }
}
