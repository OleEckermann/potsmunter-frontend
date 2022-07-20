<template>
  <div class="block">
    <div class="title">Schnittstelle ttools/Datev Unternehmen online</div>
    <div class="content box">
    <label>1. CSV Datei auswählen</label>
      <div class="field">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input
                ref="fileInput"
                class="file-input"
                type="file"
                name="resume"
                accept=".csv"
                @change="fileSelected">
            <span class="file-cta">
              <span class="file-icon">
                <icon icon="upload"></icon>
              </span>
              <span class="file-label">
                CSV
              </span>
            </span>
            <span class="file-name">
              {{ selectedFile.name }}
            </span>
          </label>
          
        </div>
      </div>
      
      <label>2. Rechnungen hochladen</label>
      <div class="field">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input
                ref="fileInputPdf"
                class="file-input"
                type="file"
                name="resume"
                accept=".pdf"
                @change="fileSelectedPdf">
            <span class="file-cta">
              <span class="file-icon">
                <icon icon="upload"></icon>
              </span>
              <span class="file-label">
                PDF
              </span>
            </span>
            <span class="file-name">
              {{ selectedPdfFile.name }}
            </span>
          </label>
          
        </div>
      </div>
      <div  id="result" style="display: none"></div>
      <p class="label">(Die Datei wird generiert und automatisch runtergeladen)</p>
      <div class="content-padding" style="padding: 10px; overflow: hidden">
        <button id="btn" class="button is-primary is-pulled-right" @click="convert()">Datei erstellen</button>
      </div>
      
    </div>
    
  </div>
</template>


  <script>
    // We need to disable es lint because of external libraries
    /* eslint-disable */ 

    import {mapActions} from "vuex";
    import {PDFDocument} from '@/plugins/pdf-lib.min.js';
    import '@/plugins/downloadjs.js';
    import JSZip from '@/plugins/jszip.js';
    import * as pdfjs from '@/plugins/pdf.js';
    import '@/plugins/pdf.worker.js';
    import '@/plugins/FileSaver.js';
    import '@/plugins/jquery.min.js';
    import * as XMLGen from '@/plugins/xmlGenerator.js';
    import {xml} from '@/plugins/vkbeautify.js';
    import mars from '@/plugins/customFile.js';
    import moment from '@/plugins/momentwithlocales.js';

    var zip = new JSZip();
    const pagesToExport = [];
    const docsToProduce = [];
    const producedDocs = [];

    let complete = 0;

    let self = this;
    

    export default {

      data() {
        return {
          selectedFile: {name: ''},
          selectedPdfFile: {name: ''},
          uploadStatus: undefined
        }
      },
      methods: {
        ...mapActions(['startLoading', 'stopLoading']),
        
        pdfToText(data, callbackPageDone, callbackAllDone, copyPagesCallback) {
          import('@/plugins/pdf.js').then((pdfjsLib) => {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.min.js";
          pdfjsLib.getDocument(data).promise.then(function (pdf) {
            var total = pdf._pdfInfo.numPages;
                //callbackPageDone( 0, total );        
                var layers = {};
                for (let i = 1; i <= total; i++) {
                    pdf.getPage(i).then(function (page) {
                        var n = page.pageNumber;
                        page.getTextContent().then(function (textContent) {
                            var page_text = "";

                            //console.log(textContent.items[0]);0
                            if (null != textContent.items) {
                                var last_block = null;
                                for (var k = 0; k < textContent.items.length; k++) {
                                    var block = textContent.items[k];
                                    if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                        if (block.x < last_block.x)
                                            page_text += "\r\n";
                                        else if (last_block.y != block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                            page_text += ' ';
                                    }
                                    page_text += block.str;

                                    last_block = block;
                                }
                                var jsonString = JSON.stringify(textContent.items);
                                
                                // textContent != null && console.log("page " + n + " finished."); //" content: \n" + page_text);
                                layers[n] = page_text + "\n\n";
                            }
                            ++complete;
                            //callbackPageDone( self.complete, total );
                            if (complete == total) {
                                window.setTimeout(function () {
                                    var full_text = "";
                                    var num_pages = Object.keys(layers).length;
                                    for (var j = 1; j <= num_pages; j++) {
                                        full_text += layers[j];

                                        for(let doc of docsToProduce) {
                                            if(layers[j].includes(doc.invoiceNum) && layers[j].includes('Gesamt (EUR)')) {
                                                doc.exportPages.push(j-1);
                                            }
                                        }
                                    }
                                        
                                    
                                    callbackAllDone(full_text);
                                    copyPagesCallback();

                                }, 1000);
                            }

                        

                        }); // end  of page.getTextContent().then
                    }); // end of page.then
                } // of for
          });
        })
        },

        readFileAsync(file) {
          return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
              resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
          });
        },

        async copyPages() {
            var fr=new FileReader();    

            // Fetch uploaded PDF file
            // const uploadedPdf = fr.result;
              var uploadedPdf = this.selectedPdfFile; 

              const pdfArrayBuffer = await this.readFileAsync(this.selectedPdfFile);

              
              // const firstDonorPdfBytes = await fetch(uploadedPdf).then(res => res.arrayBuffer())

              // Load a PDFDocument from each of the existing PDFs
              const firstDonorPdfDoc = await PDFDocument.load(pdfArrayBuffer);


              var firstDonorDocument; 
              
              for(let doc of docsToProduce) {
                // Create a new PDFDocument
                // const pdfDoc = await PDFDocument.create();
                const pdfDoc1 = await PDFDocument.create();
                let pdfBytes2;
                
                const data = JSON.parse(JSON.stringify(docsToProduce)).map(el => el.exportPages);

                if(data != null) {
                    var numbs = [];
                    numbs = numbs.concat(doc.exportPages);


                    for(let num of numbs) {
                        const [firstDonorDocument1] = await pdfDoc1.copyPages(firstDonorPdfDoc, [num]);
                        pdfDoc1.addPage(firstDonorDocument1);
                        pdfBytes2 = await pdfDoc1.save();
                    }
                    if(doc.exportPages.length !== 0) {
                        // Generate XML for each invoice and save it to ZIP FILE
                        // We're using VKBEAUTIFY to BEUTIFY OUTPUT OF XML
                        var consolidatedAmount = 0;
                        var taxAmount = 0;
                        var customerName = '';
                        var _information = '';

                        if(doc.csvObject.Rechnungsart === 'Privat') {
                            consolidatedAmount = doc.csvObject.gesamtBrutto;

                        } else if(doc.csvObject.Rechnungsart === 'Einzelrechnung') {
                            consolidatedAmount = doc.csvObject.gesamtNetto;
                        } else {
                            consolidatedAmount = doc.csvObject.gesamtNetto;
                        }

                        if(doc.csvObject.Rechnungsart === 'Einzelrechnung Kasse' || doc.csvObject.Rechnungsart === 'Kasse') {
                            customerName = doc.csvObject.Krankenkasse;
                        } else if(doc.csvObject.Rechnungsart === 'Privat' || doc.csvObject.Rechnungsart === 'Ausfall'
                        || doc.csvObject.Rechnungsart === 'Privat (HP)') {
                            customerName = doc.csvObject.Vorname + ' ' + doc.csvObject.Name;
                            consolidatedAmount = doc.csvObject.gesamtBrutto;
                        }

                        // We need to set tax amount 
                        if(doc.csvObject.Steuer === '') {
                            taxAmount = 0.00;
                        } else if(doc.csvObject.Steuer === 'USt 19%') {
                            taxAmount = 19.00;
                        } else if(doc.csvObject.Steuer === 'USt 7%') {
                            taxAmount = 7.00;
                        }

                        _information += 'Dunkelverarbeitung: ' + doc.csvObject.Rechnungsart;
                        // Information
                        if(doc.csvObject.Kennzeichen !== null && doc.csvObject.Zahlungsart !== null) {
                            if(doc.csvObject.Zahlungsart === '2') {
                                _information += ', TypEC'
                            }

                            if(doc.csvObject.Kennzeichen  === '03') {
                                _information += ', Typ03';
                                consolidatedAmount = doc.csvObject.Zuzahlung;
                            }

                            if(doc.csvObject.Kennzeichen  === '04') {
                                _information += ', Typ04'
                            }
                        }



                        var xml = await XMLGen.generateInvoiceXml(consolidatedAmount, doc.csvObject.Datum, doc.csvObject.Rechnungsnummer, "EUR",
                        doc.invoiceNum.toString(), customerName, doc.csvObject.Datum, "EUR", consolidatedAmount, taxAmount, "dueDate", "bookingText", _information)
                        xml = vkbeautify.xml(xml, 5);
                        zip.file(doc.invoiceNum + ".XML", xml);
                        this.stopLoading();

                        // Serialize the PDFDocument to bytes (a Uint8Array)
                        zip.file(doc.invoiceNum + ".pdf", pdfBytes2, {binary: true});

                        producedDocs.push(doc);
                    }
                }
                // download(pdfBytes2, "ime.pdf", "application/pdf");

              }

              // Generate XML for whole package
              // producedDocs: We need to pass produced docs to function...
              var docXml = await XMLGen.generateDocumentXml(producedDocs);
              docXml = vkbeautify.xml(docXml, 5);
              zip.file("document.XML", docXml);

              let todayDate = moment(new Date()).format('DD.MM.YYYYTHH:MM:ss');
              console.log(todayDate);

            // Generate ZIP and trigger download 
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, "ttools2Datev " + todayDate + '.zip');
                });

                document.getElementById("btn").setAttribute("aria-busy","false"); 

                // Reload page after 5 seconds 
                setTimeout(function(){
                    window.location.reload(1);
                }, 5000);
            },

        // CONVERT 
        convert() {
          this.startLoading('laden...')
          var fr=new FileReader();
          fr.onload=(event) => {
              this.pdfToText(fr.result, null, (text) => { document.getElementById('result').innerText += text; }, this.copyPages);
          }
          fr.readAsDataURL(this.selectedPdfFile);
        },
                // END OF CONVERT
        fileSelected() {
          this.selectedFile = this.$refs.fileInput.files[0]
          console.log(this.selectedFile);
          if (window.FileReader) {
          // FileReader are supported.
            this.getAsText(this.selectedFile);
          } else {
              alert('FileReader are not supported in this browser.');
          }
        },
        fileSelectedPdf() {
          this.selectedPdfFile = this.$refs.fileInputPdf.files[0]
          console.log(this.selectedFile);
        },
        getAsText(fileToRead) {
          var reader = new FileReader();
          // Read file into memory as UTF-8      
          reader.readAsText(fileToRead);
          
          // Handle errors load
          reader.onload = this.loadHandler;
          reader.onerror = this.errorHandler;
        },
        loadHandler(event) {
          var csv = event.target.result;
          this.readCSVFile(csv);
          // processData(csv);
        },
        errorHandler(evt) {
          if(evt.target.error.name == "NotReadableError") {
              alert("Canno't read file !");
          }
        },
        readCSVFile(response) {

            var lines = response.split("\n");

            var jsonObj = [];
            var headers = lines[0].split(';');

            var csvObjects = [];

            for(var i = 1; i < lines.length; i++) {
                var data = lines[i].split(';');
                var obj = {};

                for(var j = 0; j < data.length; j++) {
                    obj[headers[j].trim()] = data[j].trim();
                }
                jsonObj.push(obj);
            }


            csvObjects = JSON.parse(JSON.stringify(jsonObj));
            console.log(csvObjects);


            for (var obj of csvObjects) {
                if(obj.Rechnungsart == 'Privat' || obj.Rechnungsart == 'Kasse' || obj.Rechnungsart == 'Einzelrechnung Kasse' || obj.Rechnungsart == 'Privat (HP)' || obj.Rechnungsart == 'Ausfall') {
                    if(obj.Rechnungsnummer) {
                        var invoiceNum = JSON.stringify(obj.Rechnungsnummer);
                        if(invoiceNum != '') {
                            let csvDocument = new DocArray(obj.Rechnungsnummer, [], '', obj);
                            console.log(csvDocument);
                            docsToProduce.push(csvDocument);
                        }  
                    }
                }
            }
          }
          
      },
      mounted() {
        /*import('pdfjs-dist/build/pdf.min').then((pdfjsLib) => {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.7.570/build/pdf.worker.min.js";
          pdfjsLib.getDocument("/dummy.pdf").promise.then(function (pdf) {
            pdf.getPage(1).then((page) => {
              console.log(page);
            });
          });
        });*/
      },
      components: {}
    }

    class DocArray {
      constructor(invoiceNum, exportPages, bytesData, csvObject) {
        this.invoiceNum = invoiceNum;
        this.exportPages = exportPages;
        this.bytesData = bytesData;
        this.csvObject = csvObject;
      }
    }

    

  </script>

  