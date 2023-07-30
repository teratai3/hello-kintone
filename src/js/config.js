jQuery.noConflict();

(async ($, PLUGIN_ID) => {
  const buildDropDownForText = async (id = "") => {
    const dropdown = $('<select>').attr('id', id).prop('required', true);
    // kintone-config-helper を使ってテキスト型のフィールドを取得する
    const textFields = await KintoneConfigHelper.getFields('SINGLE_LINE_TEXT');
    dropdown.append($('<option>').attr('value', "").text("選択してください"));

    textFields.forEach((dataField) => {
      const option = $('<option>').attr('value', dataField.code).text(dataField.label);
      dropdown.append(option);
    });
    return dropdown;
  };

  try {
    const form = $('#js-submit-setting');
    const cancelButton = $('#js-cancel-button');

    // ドロップダウンフィールドを作る
    const code = await buildDropDownForText("code");
    const address = await buildDropDownForText("address");

  
    $("#js-code-fields").append(code);
    $("#js-address-fields").append(address);

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);

    if (config.code) code.val(config.code);
    if (config.address) address.val(config.address);


    form.on('submit', (e) => {
      e.preventDefault();

      kintone.plugin.app.setConfig({ 
        code: code.val(),
        address: address.val()
       }, () => {
        window.alert('プラグイン設定を保存しました。アプリを更新してください。');
        window.location.href = `/k/admin/app/${kintone.app.getId()}/plugin/`;
      });
    });

    cancelButton.on('click', () => {
      window.location.href = `/k/admin/app/${kintone.app.getId()}/plugin/`;
    });
  } catch (err) {
    window.alert(err);
  }
})(jQuery, kintone.$PLUGIN_ID);