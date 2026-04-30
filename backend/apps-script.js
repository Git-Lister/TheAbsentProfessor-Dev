function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  // Appends: Team Name, Concatenated Code, Timestamp, Time Taken
  sheet.appendRow([data.team, data.code, data.timestamp, data.timeTaken]);
  return ContentService.createTextOutput("OK");
}