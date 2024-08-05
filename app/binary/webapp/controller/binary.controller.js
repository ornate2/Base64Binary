sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.base64.binary.controller.binary", {
        onInit: function () {
            // Initialization logic if needed
        },

        onFileChange: function (oEvent) {
            // Handle file selection if needed
            var oFileUploader = oEvent.getSource();
            var aFiles = oFileUploader.getFiles();
            if (aFiles.length === 0) {
                MessageToast.show("No files selected.");
            }
        },

        onUpload: function () {
            var oFileUploader = this.byId("fileUploader");
            var aFiles = oFileUploader.getFiles();

            if (aFiles.length === 0) {
                MessageToast.show("Please select files to upload.");
                return;
            }

            aFiles.forEach(file => {
                var formData = new FormData();
                formData.append("uploadFile", file);

                fetch("/upload", {
                    method: "POST",
                    body: formData
                }).then(response => response.json())
                .then(data => {
                    MessageToast.show(data.message);
                }).catch(error => {
                    MessageToast.show("Upload failed: " + error.message);
                });
            });
        }
    });
});
