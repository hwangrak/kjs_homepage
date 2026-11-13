/**
 * KJS 홈페이지 문의 접수 스크립트
 *
 * 홈페이지 고객문의 폼이 보낸 내용을 받아서
 *  1) info@kjs-elec.kr 로 메일을 보내고
 *  2) 같은 내용을 스프레드시트에 한 줄씩 기록합니다.
 *
 * 설치 방법은 apps-script/README.md 를 보세요.
 */

var NOTIFY_EMAIL = 'info@kjs-elec.kr';
var SHEET_NAME = '문의접수';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name = String(data.name || '').trim().slice(0, 80);
    var phone = String(data.phone || '').trim().slice(0, 30);
    var email = String(data.email || '').trim().slice(0, 160);
    var type = String(data.type || '').trim().slice(0, 80);
    var message = String(data.message || '').trim().slice(0, 5000);
    var page = String(data.page || '').trim().slice(0, 200);

    if (!name || !phone || !message) {
      return respond({ ok: false, error: 'required' });
    }

    var now = new Date();
    appendRow([now, name, phone, email, type, message, page, '', '']);
    sendNotification(now, name, phone, email, type, message, page);

    return respond({ ok: true });
  } catch (error) {
    console.error(error);
    return respond({ ok: false, error: 'failed' });
  }
}

function doGet() {
  return respond({ ok: true, service: 'kjs-inquiry' });
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendRow(values) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '접수일시', '이름', '연락처', '이메일', '문의 분야', '문의내용',
      '들어온 페이지', '어떻게 알았나', '수주 여부'
    ]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow(values);
}

function sendNotification(now, name, phone, email, type, message, page) {
  var when = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  var lines = [
    '홈페이지 문의가 접수되었습니다.',
    '',
    '접수일시: ' + when,
    '이름: ' + name,
    '연락처: ' + phone,
    '이메일: ' + (email || '미입력'),
    '문의 분야: ' + type,
    '들어온 페이지: ' + (page || '-'),
    '',
    '[문의내용]',
    message,
    '',
    '개인정보 수집 및 이용 동의: 동의'
  ];

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '[KJS 홈페이지 문의] ' + type + ' / ' + name,
    body: lines.join('\n'),
    replyTo: email || undefined
  });
}
