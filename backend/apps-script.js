function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.team, data.code, data.timestamp]);
  return ContentService.createTextOutput("OK");
}
