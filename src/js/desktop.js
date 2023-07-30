jQuery.noConflict();

(function ($, PLUGIN_ID) {
  'use strict';

  const CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);

  const ZIP_API = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=";

  if (!CONFIG) {
    return false;
  }

  const CONFIG_code = CONFIG.code;
  const CONFIG_address = CONFIG.address;

  
  //https://cybozudev.zendesk.com/hc/ja/articles/202819910-%E5%A4%96%E9%83%A8API%E3%81%AE%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6
  kintone.events.on([
  'app.record.create.change.' + CONFIG_code,
  'app.record.edit.change.' + CONFIG_code,
  'app.record.index.edit.change.' + CONFIG_code
  ], (event) => {
    const rec = event.record;
    $.ajax({
      url: ZIP_API + rec[CONFIG_code].value.replace("-", ""),
      type: 'GET',
      timeout: 10000, //タイムアウト時間
      dataType: 'json',
      async: false, //同期処理変更に終わってからだとinput変更できない
      success: function(data) {
        if (data.status === 400) {
          console.log(data.message);
        } else if (data.results === null) {
          console.log("郵便番号から住所が見つかりませんでした。");
        } else {
        rec[CONFIG_address].value = data.results[0].address1 + data.results[0].address2 + data.results[0].address3;
        }
        
      },
      error: function(ex) {
        console.log(ex); //例外処理
      }
    });

    return event;
  });

})(jQuery, kintone.$PLUGIN_ID);
