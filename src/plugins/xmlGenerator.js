

let moment = require('./momentwithlocales');
moment.locale('de')

export async function generateDocumentXml(producedDocs) {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    console.log(producedDocs);
    const doc = document.implementation.createDocument("", "", null);
    const peopleElem = doc.createElement("content");

    const pi = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');

    doc.insertBefore(pi, doc.firstChild);

    // ARCHIVE
    const archive = doc.createElement("archive");
    archive.setAttribute('xmlns', 'http://xml.datev.de/bedi/tps/document/v05.0');
    archive.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    archive.setAttribute('xsi:schemaLocation', 'http://xml.datev.de/bedi/tps/document/v05.0 Document_v050.xsd');
    archive.setAttribute('version', '5.0');
    archive.setAttributeNS(null,'generatingSystem', "Potsmunter ttools2Datev");

    // HEADER
    let header = doc.createElement('header');
    let headerDate = doc.createElement('date');
    let currentTimeZone = doc.createTextNode(moment().format('YYYY-MM-DDTHH:MM:ss'));
    headerDate.appendChild(currentTimeZone);
    header.appendChild(headerDate);

    archive.appendChild(header);
    archive.appendChild(peopleElem);

    for (let docx of producedDocs) {
        const documentElement = doc.createElement("document");
        const extension = doc.createElement("extension");
        extension.setAttribute('xsi:type', 'accountsReceivableLedger');
        extension.setAttribute('datafile', docx.invoiceNum + ".xml");
        
        const extensionSecond = doc.createElement('extension');
        extensionSecond.setAttribute('xsi:type', 'File');
        extensionSecond.setAttribute('name', docx.invoiceNum + ".pdf");

        const formattedDate = moment(docx.csvObject.Datum, 'DD.MM.YYYY').format('YYYY-MM');
        const onlyYear = moment(docx.csvObject.Datum, 'DD.MM.YYYY').format('YYYY');

        // Property (inside extension)
        const propertyNode = doc.createElement("property");
        propertyNode.setAttribute('value', formattedDate);
        propertyNode.setAttribute('key', '1');



       //  var newDates = moment().format(producedDocs[i].Datum).format('YYYY-MM')
        // console.log(newDates);

        const propertySecondNode = doc.createElement("property");
        propertySecondNode.setAttribute('value', 'Ausgangsrechnungen');
        propertySecondNode.setAttribute('key', '3');


        // Repository
        const repository = doc.createElement("repository");

        const repositoryLevel = doc.createElement("level");
        repositoryLevel.setAttribute('id', '1');
        repositoryLevel.setAttribute('name', 'Buchführung')

        const repositorySecondLevel = doc.createElement("level");
        repositorySecondLevel.setAttribute('id', '2');
        repositorySecondLevel.setAttribute('name', 'Buchhaltung ' + onlyYear);

        const repositoryThirdLevel = doc.createElement("level");
        repositoryThirdLevel.setAttribute('id', '3');
        repositoryThirdLevel.setAttribute('name', 'Standardregister');

        // We need to append elements to their roots

        extension.appendChild(propertyNode);
        extension.appendChild(propertySecondNode);
        documentElement.appendChild(extension);    
        documentElement.appendChild(extensionSecond); 
        documentElement.appendChild(repository);
        repository.appendChild(repositoryLevel);
        repository.appendChild(repositorySecondLevel);
        repository.appendChild(repositoryThirdLevel);

        peopleElem.appendChild(documentElement);
    }

    

    // peopleElem.appendChild(ena);

    doc.appendChild(archive);   
 

    //doc.appendChild(ena);    


    
    let docStr = new XMLSerializer().serializeToString(doc);

    return docStr;
}



// Function used for generating xml for each invoice!
export async function generateInvoiceXml(consolidatedAmount, consolidatedDate, consolidatedInvoiceId, consolidatedCurrencyCode,
    invoiceId, customerName, date, curencyCode, amount, tax, dueDate, bookingText, information) {

        const doc = document.implementation.createDocument("", "", null);
    
        const pi = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
    
        doc.insertBefore(pi, doc.firstChild);

        consolidatedDate = moment(consolidatedDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
    
        let ledgerImportNode = doc.createElementNS('http://www.w3.org/1999/xhtml','LedgerImport');
        ledgerImportNode.setAttribute('xmlns', 'http://xml.datev.de/bedi/tps/ledger/v050');
        ledgerImportNode.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        ledgerImportNode.setAttribute('xsi:schemaLocation', 'http://xml.datev.de/bedi/tps/ledger/v050 Belegverwaltung_online_ledger_import_v050.xsd');
        ledgerImportNode.setAttribute('version', '5.0');
        ledgerImportNode.setAttribute('generator_info', "potsmunter");
        ledgerImportNode.setAttribute('generating_system', "Potsmunter ttools2Datev");
        ledgerImportNode.setAttribute('xml_data', "Kopie nur zur Verbuchung berechtigt nicht zum Vorsteuerabzug");
        


        let consolidate = doc.createElement('consolidate');
        consolidate.setAttributeNS(null,'consolidatedAmount', consolidatedAmount);
        consolidate.setAttributeNS(null,'consolidatedDate', consolidatedDate);
        consolidate.setAttributeNS(null,'consolidatedInvoiceId', consolidatedInvoiceId);
        consolidate.setAttributeNS(null,'consolidatedCurrencyCode', consolidatedCurrencyCode);
    
        // let _newLine = document.createElement('&#xA;');
    
    
        let ledgerNode = doc.createElementNS('http://www.w3.org/1999/xhtml','accountsReceivableLedger');
    
        // Date
        let changedDateFormat = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD');
        let _date = doc.createElementNS('http://www.w3.org/1999/xhtml', 'date');
        let dateInnerNode = doc.createTextNode(changedDateFormat);
        _date.appendChild(dateInnerNode);
        ledgerNode.appendChild(_date);

        // Amount
        let _amount = doc.createElementNS('http://www.w3.org/1999/xhtml', 'amount');
        let amountInnerNode = doc.createTextNode(amount);
        _amount.appendChild(amountInnerNode);
        ledgerNode.appendChild(_amount);

         
        // Tax
        console.log('LAST TAX:: ' + tax.toString());
        let _tax = doc.createElementNS('http://www.w3.org/1999/xhtml', 'tax');
        let taxInnerMode = doc.createTextNode(tax.toFixed(2));
        _tax.appendChild(taxInnerMode);
        ledgerNode.appendChild(_tax);

        // Information
        let _information = doc.createElementNS('http://www.w3.org/1999/xhtml', 'information');
        let informationInnerMode = doc.createTextNode(information);
        _information.appendChild(informationInnerMode);
        ledgerNode.appendChild(_information);

        // Currency code
        let _currencyCode = doc.createElementNS('http://www.w3.org/1999/xhtml', 'currencyCode');
        let currencyCodeInnerNode = doc.createTextNode(curencyCode);
        _currencyCode.appendChild(currencyCodeInnerNode);
        ledgerNode.appendChild(_currencyCode);
    
        // Invoice id
        let _invoiceId = doc.createElementNS('http://www.w3.org/1999/xhtml', 'invoiceId');
        let invoiceInnerNode = doc.createTextNode(invoiceId);
        _invoiceId.appendChild(invoiceInnerNode);
        ledgerNode.appendChild(_invoiceId);

        // Due date
        var new_date = moment(date, "DD-MM-YYYY").add(30, 'days').format('YYYY-MM-DD');

        /*let _dueDate = doc.createElementNS('http://www.w3.org/1999/xhtml', 'dueDate');
        let dueDateInnerNode = doc.createTextNode(new_date);
        _dueDate.appendChild(dueDateInnerNode);
        ledgerNode.appendChild(_dueDate);*/

        // Payment conditionsId
        let _paymentConditions = doc.createElementNS('http://www.w3.org/1999/xhtml', 'paymentConditionsId');
        let paymentConditionsNode = doc.createTextNode(9);
        _paymentConditions.appendChild(paymentConditionsNode);
        ledgerNode.appendChild(_paymentConditions);
    
        // Customer Name
        let _customerName = doc.createElementNS('http://www.w3.org/1999/xhtml', 'customerName');
        let customerNameInnerNode = doc.createTextNode(customerName);
        _customerName.appendChild(customerNameInnerNode);
        ledgerNode.appendChild(_customerName);

        doc.appendChild(ledgerImportNode);
        ledgerImportNode.appendChild(consolidate);
        consolidate.appendChild(ledgerNode);

        
    
        // 1.) use XMLSerializer
        let xml = new XMLSerializer().serializeToString(doc);
    
        // 2.) remove xml namespace
    

        let xmlWithoutNamespace = xml.replaceAll('xmlns="http://www.w3.org/1999/xhtml"', '');
        xmlWithoutNamespace = xmlWithoutNamespace.replace('xmlns=""', '');
        xmlWithoutNamespace = xmlWithoutNamespace.replace('Ledger >', 'Ledger>');

        return xmlWithoutNamespace;

}

