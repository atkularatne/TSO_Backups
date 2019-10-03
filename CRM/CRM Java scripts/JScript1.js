function visibleClaimForm() {
    var in_scheme_scope_value = Xrm.Page.getAttribute("tsowl_in_scheme_scope").getValue();
    if (in_scheme_scope_value != false) {
        // disply claim form
        Xrm.Page.ui.tabs.get("tab_claim").setVisible(true);
        setVisibleClaimDecision();
        disableClaimForm();
        // CR 189
        disableClaimDecFileProcess();
    }
}

function disableClaimForm() {
    var decisionCardFileFlagValue = Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").getValue();
    var reassessedCardFileFlagValue = Xrm.Page.getAttribute("tsowl_claim_reassed_dec_card_file_processed").getValue();
    if (decisionCardFileFlagValue == true) {
        Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(true);
        Xrm.Page.getControl("tsowl_claim_decision_card_date").setDisabled(true);
    }
    if (reassessedCardFileFlagValue == true) {
        Xrm.Page.getControl("tsowl_claim_reassessed_decision_card").setDisabled(true);
        Xrm.Page.getControl("tsowl_claim_reassessed_decision_card_date").setDisabled(true);
    }
}
// visible based on qualifing policy type

function setVisibleClaimDecision() {
    var qualifyPolicyType = Xrm.Page.getAttribute("tsowl_qualifying_policy_types").getValue();
    var decisionCardValue = Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue();
    // check box values
    var decisionCardFlagValue = Xrm.Page.getAttribute("tsowl_claim_decision_card_processed").getValue();
    var reassessedCardFlagValue = Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card_processed").getValue();
    Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_claim_card").setVisible(false);
    Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_birth_details").setVisible(false);
    Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(false);
    Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(true);
    // Qualifing Policy type == CARD
    if (qualifyPolicyType == "736090001") {
        Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_birth_details").setVisible(true);
        Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_claim_card").setVisible(true);
        // checked box selected
        if (decisionCardFlagValue == true) {
            Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(true);
            Xrm.Page.getControl("tsowl_claim_decision_card_date").setDisabled(true);
            //Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(true);
            if (reassessedCardFlagValue == true) {
                Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(true);
                Xrm.Page.getControl("tsowl_claim_reassessed_decision_card").setDisabled(true);
                Xrm.Page.getControl("tsowl_claim_reassessed_decision_card_date").setDisabled(true);
            }
            else {
                // if ((decisionCardValue != "736090001") && (decisionCardValue != null)) { // Not Upheld
                if ((decisionCardValue != "736090000") && (decisionCardValue != "736090001") && (decisionCardValue != null)) { // Not Upheld 
                    Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(true);
                    Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(true);
                    if (UserHasRole("EY User") || UserHasRole("System Administrator")) {
                        Xrm.Page.getControl("tsowl_claim_reassessed_decision_card").setDisabled(false);
                        Xrm.Page.getControl("tsowl_claim_reassessed_decision_card_date").setDisabled(false);
                    }
                    else {
                        Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(false);
                    }
                }
                else {
                    Xrm.Page.ui.tabs.get("tab_claim").sections.get("tab_claim_re_assessed").setVisible(false);
                }
            }
        }
        else {
            //if (UserHasRole("WL User") || UserHasRole("EY User")) {
            if (UserHasRole("WL User") || UserHasRole("EY User") || UserHasRole("System Administrator")) {
                Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(false);
            }
            else {
                Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(true);
            }
        }
    }
}
// Decision card value change event

function setDecisionCardDate() {
    var decisionCardValue = Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue();
    var decisionCardDate = Xrm.Page.getAttribute("tsowl_claim_decision_card_date").getValue();
    if (decisionCardValue != null) {
        // set this field required level
        Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setRequiredLevel("required");
        if (UserHasRole("WL User")) {
            // if decision type is Declined or Happy with policy
            if (decisionCardValue == "736090002") {
                alert("WL User Can not select Declined");
                Xrm.Page.getControl("tsowl_claim_decision_card").setFocus(true);
                Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(InitValues.CLAIM_DECISION_CARD_FIELD);
            }
            else if (decisionCardValue == "736090003") {
                alert("WL User Can not select Happy with policy");
                Xrm.Page.getControl("tsowl_claim_decision_card").setFocus(true);
                Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(InitValues.CLAIM_DECISION_CARD_FIELD);
            }
            else if (decisionCardDate == null) {
                Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(new Date());
            }
        }
        else if (decisionCardDate == null) {
            Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(new Date());
        }
    }
    else {
        // set this field required level
        Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setRequiredLevel("none");
        Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(null);
    }
}
// CR 117 :Decision card value change event
/*function setDecisionCardDate() {
var decisionCardValue = Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue();
    
// update saved values
if (InitValues.CLAIM_DECISION_CARD_FIELD != "NULL") {
var message = confirm("Claim decision already captured. Are you sure you wish to change this decision?");
if (message == true) {
updateClaimDecision();
}
else // false
{
Xrm.Page.getControl("tsowl_claim_decision_card").setFocus(true);
Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(InitValues.CLAIM_DECISION_CARD_FIELD);
}
}
else if ((decisionCardValue != null) && (InitValues.CLAIM_DECISION_CARD_FIELD == "NULL")) {
updateClaimDecision();
}
else {   // set this fields as required 
Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setRequiredLevel("none");
Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(null);
}
}

function updateClaimDecision() {
var decisionCardValue = Xrm.Page.getAttribute("tsowl_claim_decision_card").getValue();
var decisionCardDate = Xrm.Page.getAttribute("tsowl_claim_decision_card_date").getValue();
Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setRequiredLevel("required");
    
if (UserHasRole("WL User")) {
// if decision type is Declined or Happy with policy
if (decisionCardValue == "736090002") {
alert("WL User Can not select Declined");
Xrm.Page.getControl("tsowl_claim_decision_card").setFocus(true);
Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(InitValues.CLAIM_DECISION_CARD_FIELD);
}
else if (decisionCardValue == "736090003") {
alert("WL User Can not select Happy with policy");
Xrm.Page.getControl("tsowl_claim_decision_card").setFocus(true);
Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(InitValues.CLAIM_DECISION_CARD_FIELD);
}
else if ((decisionCardDate == null) || (decisionCardDate == "")) {
Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(new Date());
}
}
else if ((decisionCardDate == null) || (decisionCardDate == "")) {
Xrm.Page.data.entity.attributes.get("tsowl_claim_decision_card_date").setValue(new Date());
}
}*/
function saveDisableFileds() {
    Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setSubmitMode("always");
    Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card_date").setSubmitMode("always");
}
// set Reassessed Decision card value change event

function setReassessedDecCardDate() {
    var reassedDecisionCardValue = Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card").getValue();
    var reassedDecisionCardDate = Xrm.Page.getAttribute("tsowl_claim_reassessed_decision_card_date").getValue();
    if (reassedDecisionCardValue != null) {
        if (UserHasRole("EY User")) {
            if (reassedDecisionCardDate == null) {
                Xrm.Page.data.entity.attributes.get("tsowl_claim_reassessed_decision_card_date").setValue(new Date());
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------------------------------

function validDecisionValues(ExecutionObj) {
    var decisionCardDate = Xrm.Page.getAttribute("tsowl_claim_decision_card_date").getValue();
    var decisionIdenDate = Xrm.Page.getAttribute("tsowl_claim_decision_identity_date").getValue();
    // Target date 2014 - 02 - 13
    var targetDate = new Date(2014, 01, 13);
    if (Xrm.Page.getAttribute("tsowl_claim_decision_card_date").getRequiredLevel() == "required") {
        if (decisionCardDate < targetDate) {
            alert("Please select Claim Decision Card Date after 13/02/2014");
            Xrm.Page.getControl("tsowl_claim_decision_card_date").setFocus(true);
            //stop saving
            ExecutionObj.getEventArgs().preventDefault();
        }
    }
    if (Xrm.Page.getAttribute("tsowl_claim_decision_identity_date").getRequiredLevel() == "required") {
        if (decisionIdenDate < targetDate) {
            alert("Please select Claim Decision Identity Date after 13/02/2014");
            Xrm.Page.getControl("tsowl_claim_decision_identity_date").setFocus(true);
            //stop saving
            ExecutionObj.getEventArgs().preventDefault();
        }
    }
}
// -------------------------CR 186---------------------------
// Claim File Process checked event
function claimdecFileProcMessage() {
    var decisionCardFileProcessFlag = Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").getValue();
    var decisionCardProcessFlag = Xrm.Page.getAttribute("tsowl_claim_decision_card_processed").getValue();
    if ((!decisionCardFileProcessFlag) && (InitValues.CLAIM_DEC_CARD_PROCESS)) {
        var confirmMessage = confirm("Caution - This record has already had decision locked. You may need to advise Affinion that decision has been removed");
        if (confirmMessage == true) {
            //x = "You pressed OK!";
            Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").setValue(false);
            Xrm.Page.getControl("tsowl_claim_decision_card").setDisabled(false);
            Xrm.Page.getAttribute("tsowl_claim_decision_card").setValue(null);
            //Xrm.Page.getControl("tsowl_claim_decision_card_date").setDisabled(false);
            Xrm.Page.getAttribute("tsowl_claim_decision_card_date").setValue(null);
        }
        else {
            Xrm.Page.getAttribute("tsowl_claim_decision_card_file_processed").setValue(true);
        }
    }
}
// disable Claim Decession field

function disableClaimDecFileProcess() {
    var decisionCardProcessFlag = Xrm.Page.getAttribute("tsowl_claim_decision_card_processed").getValue();
    if (decisionCardProcessFlag) {
        Xrm.Page.getControl("tsowl_claim_decision_card_file_processed").setDisabled(true);
    }
}