
setOptionSetByOptionText = function (optionsetAttribute, optionText) {
    var options = Xrm.Page.getAttribute(optionsetAttribute).getOptions();
    for (i = 0; i < options.length; i++) {
        if (options[i].text == optionText)
            Xrm.Page.getAttribute(optionsetAttribute).setValue(options[i].value);
    }
}

function setOptionsetDefaultValue() 
{
    var createdfromcode = Xrm.Page.getAttribute("createdfromcode").getText();
    var formtype = Xrm.Page.ui.getFormType();

    if ((createdfromcode == null) && (formtype ==1))
    {
        setOptionSetByOptionText("createdfromcode", "Contact");
    }
}