function hours(input: number){
    return input * 60;
}

function minutes(input: number){
    return input * 1;
}

export default {
    // Maximal amount of digits/characters a from field is allowed to contain. 
    textFromField: {
        maxDigits: 16,
        maxChars: 11
    },
    validityTime: {
        default: hours(48),
        minimum: minutes(1),
        maximum: hours(48)
    },
    links: {
        helpDocs: {
            phoneNumberFormat: "https://www.cm.com/blog/how-to-format-international-telephone-numbers/",
            specialCharacters: "https://en.wikipedia.org/wiki/GSM_03.38#GSM_7-bit_default_alphabet_and_extension_table_of_3GPP_TS_23.038_/_GSM_03.38",
            statusReports: "https://help.cmtelecom.com/en/account-wallet/account/how-can-i-use-status-reports",
            smsSenderRestrictions: "https://help.cmtelecom.com/en/text/sms-faq/is-it-possible-to-set-my-own-sender-name-sender-id",
            countryRestrictions: "https://help.cmtelecom.com/en/text/countries"
        },
        appkey: "https://appmanager.cmtelecom.com/",
        productToken: "https://gateway.cmtelecom.com/",
        addressbook: "https://addressbook.cmtelecom.com/",
        voiceTest: "https://voicecampaigns.cmtelecom.com"
    }
}