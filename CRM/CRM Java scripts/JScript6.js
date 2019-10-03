function addPaymentTypeLink() {
    var paymentType = Xrm.Page.getAttribute("wl_type").getText();
    if (paymentType != "Unknown")
        addLinkAtTop("wl_type", "tab_general_section", "openPayment()", -1);
}

function addLinkAtTop(fieldName, sectionName, jsOpenFunctionName, deleteIndex) {
    var paymentType = Xrm.Page.getAttribute(fieldName).getText();
    if (paymentType != null) {

        var div = document.createElement("div");
        div.style.width = "19%";
        div.style.textAlign = "right";
        div.style.display = "inline";

        var selectList = '<table><tr><td width="50%" align="left"><a href="javascript:' + jsOpenFunctionName + '" style="color:#0000ff;font-weight:bold;text-decoration:underline">' + paymentType + ' Payment</a></td></tr></table>';

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


function openPayment() {

    var paymentId = Xrm.Page.data.entity.getId();
    var paymentType = Xrm.Page.getAttribute("wl_type").getText();

    var entity_logical_name;
    var entity_attribute_name;

    switch (paymentType) {
        case "Cash":
            entity_logical_name = "inpswl_cashpayment"; //
            entity_attribute_name = "inpswl_cashpaymentid";
            break;
        case "Wire Transfer": //online tranfer
            entity_logical_name = "inpswl_onlinetransferpayment";
            entity_attribute_name = "inpswl_onlinetransferpaymentid";
            break;
        case "Remote Cheque":
            entity_logical_name = "inpswl_chequepayment"; //
            entity_attribute_name = "inpswl_chequepaymentid";
            break;
        case "SEPA":
            entity_logical_name = "inpswl_sepapayment"; //
            entity_attribute_name = "inpswl_sepapaymentid";
            break;
        case "ACH":
            entity_logical_name = "inpswl_achpayment";
            entity_attribute_name = "inpswl_achpaymentid"; //
            break;
        case "Masspay":
            //entity_logical_name = "inpswl_cashpayment";
            //entity_attribute_name = "inpswl_cashpaymentid";
            break;
        default:
            break;
    }

    var fetchXmlFindPayments = "<fetch mapping='logical' version='1.0'>" +
            "<entity name='" + entity_logical_name + "'>" +
            "<attribute name='" + entity_attribute_name + "' />" +
            "<filter>" +
            "<condition attribute='inpswl_paymentid' operator='eq' value='" + paymentId + "' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

    var payments = CrmFetchKit.FetchSync(fetchXmlFindPayments);

    if (payments != null) {
        var recordGuid;
        switch (paymentType) {
            case "Cash":
                recordGuid = payments[0].attributes.inpswl_cashpaymentid.value; //
                break;
            case "Wire Transfer": //online transfer
                recordGuid = payments[0].attributes.inpswl_onlinetransferpaymentid.value;
                break;
            case "Remote Cheque":
                recordGuid = payments[0].attributes.inpswl_chequepaymentid.value; //
                break;
            case "SEPA":
                recordGuid = payments[0].attributes.inpswl_sepapaymentid.value; //
                break;
            case "ACH":
                recordGuid = payments[0].attributes.inpswl_achpaymentid.value; //
                break;
            case "Masspay":
                //recordGuid = payments[0].attributes.inpswl_cashpaymentid.value;
                break;
            default:
                break;
        }
        //OpenRecords(payments[0].attributes.inpswl_cashpaymentid.value, "inpswl_cashpayment", "");
        OpenRecords(recordGuid, entity_logical_name, "");
    }
    else {
        alert("Related payment record not found");
    }
}

function OpenRecords(Record_Id, Logical_Name_Of_Entity, Extras) {

    var reletivePath = "/main.aspx?etn=" + Logical_Name_Of_Entity;
    //var reletivePath = "/main.aspx?etc=10016"; // cash payment
    reletivePath = reletivePath + "&" + Extras + "pagetype=entityrecord&id=";

    var height = 600; // Height of the Record Page.
    var width = 1200; // Width of the Record Page.
    var windowName = "_blank";
    var serverUrl = Xrm.Page.context.getClientUrl();
    var nAgt = navigator.userAgent;

    if (serverUrl != null && serverUrl != "") {
        serverUrl = serverUrl + reletivePath;
        serverUrl = serverUrl + Record_Id

        openStdWin(serverUrl,
                       null,
                       height,
                       width,
                       "titlebar=yes, resizable=yes");
    }
}

