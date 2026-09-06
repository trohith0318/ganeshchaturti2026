function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Sheet1");

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.fullName || "",
      data.studentFaculty || "",
      data.donationCollection || "",
      data.utrId || "",
      data.paymentDate || "",
      data.note || "",
      new Date()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Donation data saved successfully"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
