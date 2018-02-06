﻿$(document).ready(() => {
    console.log('jQuery Admin ready');

    //Testdaten
    $('#adminUsername').val('testadmin1');
    $('#adminPasswort').val('hallo123');

    //Anmeldevorgang
    $('#adminLoginButton').on('click', CheckAdminInfo);

    //Suchtrigger Aufgaben
    $('#stations_admin').on('change', StationSelected);
    $('#searchFrageText').on('click', SearchFrageText);

    $('#searchFrageField').bind('enterKey', SearchFrageText);
    $('#searchFrageField').keydown(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger('enterKey');
            e.preventDefault();
        }
    });

    //Suchtrigger Fragen
    $('#searchFrageText_AufgabeEditView').on('click', SearchFrageText_AufgabeEditView_Frage);

    $('#searchFrageField_AufgabeEditView').bind('enterKey2', SearchFrageText_AufgabeEditView_Frage);
    $('#searchFrageField_AufgabeEditView').keydown(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger('enterKey2');
            e.preventDefault();
        }
    });

    //Suchtrigger Antworten
    $('#searchAntwortText_AufgabeEditView').on('click', SearchAntwortText_AufgabeEditView_Antwort);

    $('#searchAntwortField_AufgabeEditView').bind('enterKey3', SearchAntwortText_AufgabeEditView_Antwort);
    $('#searchAntwortField_AufgabeEditView').keydown(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger('enterKey3');
            e.preventDefault();
        }
    });


    //AufgabeItemButtons
    $('.aufgabe_Info').on('click', AufgabeInfoClicked);
    $('.aufgabe_warning').on('click', AufgabeEditClicked);
    $('.aufgabe_danger').on('click', AufgabeDeleteClicked);

    //AdminItemButtons
    $('.admin_Info').on('click', AdminInfoClicked);
    $('.admin_warning').on('click', AdminEditClicked);
    $('.admin_danger').on('click', AdminDeleteClicked);

    //FrageItemButtons
    $('.frage_Info').on('click', FrageInfoClicked);
    $('.frage_warning').on('click', FrageEditClicked);
    $('.frage_danger').on('click', FrageDeleteClicked);

    //AntwortItemButtons
    $('.antwort_Info').on('click', AntwortInfoClicked);
    $('.antwort_warning').on('click', AntwortEditClicked);
    $('.antwort_danger').on('click', AntwortDeleteClicked);

    //ZusatzInfoItemButtons
    $('.info_Info').on('click', ZusatzInfo_InfoClicked);
    $('.info_danger').on('click', ZusatzInfo_DeleteClicked);

    //new Antwort
    $('#newAntwort_AufgabeEditView').on('click', CreateAntwortClicked);
    $('#create_antwort_button').on('click', CreateAntwort);

    //new Frage
    $('#newFrage_AufgabeEditView').on('click', CreateFrageClicked);
    $('#create_frage_button').on('click', CreateFrage);

    //Frage auswählen
    $('.frageobject').on('click', SelectFrage);

    //Antworttyp Select
    $('#aufgabeEdit_antworttyp_select').on('change', SelectAntworttyp);

    //AntwortDialog Neu Select Typ
    $('#antwortTypSelectNew').on('change', AntwortNewDialogTypeChanged);

    //new Admin
    $('#create_new_admin').on('click', CreateAdminClicked);
    $('#create_admin_button').on('click', CreateAdmin);

    //editAufgabe
    $('#adminEdit_bezirk_select').on('change', SetStandorteBezirk);

});

var id_cbNew_AntwortRichtig = 1;
var id_cbNew_AntwortFalsch = 1;
var id_rbNew_AntwortFalsch = 1;

var id_cbEdit_AntwortRichtig = 100;
var id_cbEdit_AntwortFalsch = 100;
var id_rbEdit_AntwortFalsch = 100;

var editAntwortTypeChanged = false;

//LoginInformationen prüfen
function CheckAdminInfo() {
    //Eingabewerte holten + Testausgabe
    var input_username = $('#adminUsername').val();
    var input_password = $('#adminPasswort').val();

    console.log('Username: ' + input_username);
    console.log('Password: ' + input_password);

    //C# Überprüfung, ob gültiger User
    const url = '/Admin/CheckAdminInfo';
    $.post(url, {
        username: input_username,
        password: input_password
    }).then(reply => {
        console.log(`ServerReply CheckAdminInfo: ${reply}`);
        if (reply === 'username_fail') {
            $('#LoginError').html('User ist nicht vorhanden!');
        } else if (reply === 'password_fail') {
            $('#LoginError').html('Falsches Passwort!');
        } else if (reply === 'ok') {
            window.open('AdminOverview');
            self.close();
        }
    });

}

function StationSelected() {
    var selectedStation = $('#stations_admin').val();
    console.log(`Selected Station: ${selectedStation}`);

    if (selectedStation != "noItemSelected") {

        var aufgabenLI_list = $('#admin_aufgabenliste').children();
        for (var i = 0; i < aufgabenLI_list.length; i++) {
            var aufgabe_li = aufgabenLI_list[i];
            var id_split = aufgabe_li.id.split("-");
            if (id_split[1] != selectedStation) {
                $(`#${aufgabe_li.id}`).hide();
            } else {
                $(`#${aufgabe_li.id}`).show();
            }
        }

    } else {
        var aufgabenLI_list = $('#admin_aufgabenliste').children();
        for (var i = 0; i < aufgabenLI_list.length; i++) {
            var aufgabe_li = aufgabenLI_list[i];
            $(`#${aufgabe_li.id}`).show();
        }

    }

}

function SearchFrageText() {
    var eingabe = $('#searchFrageField').val();
    console.log(`Eingegebener Text: ${eingabe}`);

    var aufgabenLI_list = $('#admin_aufgabenliste').children();
    for (var i = 0; i < aufgabenLI_list.length; i++) {
        var aufgabe_li = aufgabenLI_list[i];
        var span_frage = $(`#${aufgabe_li.id}`).children().first();
        if (span_frage.text().toUpperCase().search(eingabe.toUpperCase()) != -1) {
            $(`#${aufgabe_li.id}`).show();
        } else {
            $(`#${aufgabe_li.id}`).hide();
        }
    }

}

//FEHLER ComboBox wird nicht beachtet
function SearchFrageText_AufgabeEditView_Frage() {
    var eingabe = $('#searchFrageField_AufgabeEditView').val();
    console.log(`Eingegebener Text: ${eingabe}`);

    var station_selected = $('#stations_admin').val();
    console.log(`Ausgewählte Station: ${station_selected}`);
    if (station_selected != "noItemSelected") {

    }

    var fragenLI_list = $('#frageliste_aufgabeEditView').children();
    for (var i = 0; i < fragenLI_list.length; i++) {
        var frage_li = fragenLI_list[i];

        var span_frage = $(`#${frage_li.id}`).children().first();

        if (span_frage.text().toUpperCase().search(eingabe.toUpperCase()) != -1) {
            $(`#${frage_li.id}`).show();
        } else {
            $(`#${frage_li.id}`).hide();
        }
    }

}


//FEHLER ComboBox wird nicht beachtet
function SearchAntwortText_AufgabeEditView_Antwort() {
    var eingabe = $('#searchAntwortField_AufgabeEditView').val();
    console.log(`Eingegebener Text: ${eingabe}`);

    var antworttyp_selected = $('#aufgabeEdit_antworttyp_select').val();
    console.log(`Antworttyp Selected: ${antworttyp_selected}`);
    if (antworttyp_selected != "noItemSelected") {

    }

    var antwortenLI_list = $('#antwortliste_aufgabeEditView').children();
    for (var i = 0; i < antwortenLI_list.length; i++) {
        var antwort_li = antwortenLI_list[i];

        var span_antwort = $(`#${antwort_li.id}`).children().first();

        if (span_antwort.text().toUpperCase().search(eingabe.toUpperCase()) != -1) {
            $(`#${antwort_li.id}`).show();
        } else {
            $(`#${antwort_li.id}`).hide();
        }
    }
}

//AufgabeButtonFunctions
function AufgabeInfoClicked(event) {
    console.log('Aufgabe Info Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetAufgabeInfo?aufgabe_id=${id}`;
    $('#loadModal').load(url, () => {
        $('#aufgabeInfo_Modal').modal('show');
    });

}

function AufgabeEditClicked(event) {
    console.log('Aufgabe Edit Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    window.open(`AufgabeEditView?aufgabe_id=${id}`);
    //$('#aufgabeEdit_Modal').modal('show');


}

function AufgabeDeleteClicked(event) {
    console.log('Aufgabe Delete Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetAufgabeDelete?aufgabe_id=${id}`;
    $('#loadModal').load(url, () => {
        $('#aufgabeDelete_Modal').modal('show');
        $('#deleteAufgabe').on('click', DeleteAufgabe);
    });


}

//AdminButtonFunctions
function AdminInfoClicked(event) {
    console.log('Admin Info Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetAdminInfo?admin_id=${id}`;
    $('#loadModal').load(url, () => {
        $('#adminInfo_Modal').modal('show');
    });

}

function AdminEditClicked(event) {
    console.log('Admin Edit Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetAdminEdit?admin_id=${id}`;
    $('#loadModal').load(url, () => {
        $('#adminEdit_Modal').modal('show');
        $('#saveAdminChanges').on('click', SaveAdminChanges);
    });

}

function AdminDeleteClicked(event) {
    console.log('Admin Delete Clicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetAdminDelete?admin_id=${id}`;
    $('#loadModal').load(url, () => {
        $('#adminDelete_Modal').modal('show');
        $('#deleteAdmin').on('click', DeleteAdmin);
    });

}

function SaveAdminChanges() {
    console.log('enter SaveAdminChanges');

    //Eingabewerte auslesen und testen
    var admin_id_selected = $('#admin_id_edit').text();
    var username_input = $('#changeUsername').val();
    var password_input = $('#changePassword').val();
    var can_create_acc_input = $('input[name=admin_create_option]:checked').val();
    var can_edit_acc_input = $('input[name=admin_edit_option]:checked').val();
    var can_delete_acc_input = $('input[name=admin_delete_option]:checked').val();

    console.log('Testausgabe-EditAdminData Benutzereingaben:');
    console.log(`Admin_ID: ${admin_id_selected}`);
    console.log(`Username: ${username_input}`);
    console.log(`Password: ${password_input}`);
    console.log(`Can_Create_Acc: ${can_create_acc_input}`);
    console.log(`Can_Edit_Acc: ${can_edit_acc_input}`);
    console.log(`Can_Delete_Acc: ${can_delete_acc_input}`);

    const url = `/Admin/SaveAdminChanges`;
    $.post(url, {
        admin_id: admin_id_selected,
        username: username_input,
        password: password_input,
        can_create_acc: can_create_acc_input,
        can_edit_acc: can_edit_acc_input,
        can_delete_acc: can_delete_acc_input
    }).then(result => {
        console.log(`ServerReply SaveAdminChanges: ${result}`);
        location.reload();
    });


}

function DeleteAdmin() {
    console.log('enter DeleteAdmin');

    var admin_id = $('#admin_id_delete').text();
    console.log(`Admin_ID: ${admin_id}`);

    const url = `/Admin/DeleteAdmin`;
    $.post(url, {
        admin_id: admin_id
    }).then(result => {
        console.log(`ServerReply DeleteAdmin: ${result}`);
        location.reload();
    });

}

function CreateAdminClicked() {
    console.log('enter CreateAdminClicked');
    $('#adminCreate_Modal').modal('show');
}

function CreateAdmin() {
    console.log('enter CreateAdmin');

    //Eingabewerte auslesen und testen
    var username_input = $('#newAdmin_Username').val();
    var password_input = $('#newAdmin_Password').val();
    var can_create_acc_input = $('input[name=admin_create_option]:checked').val();
    var can_edit_acc_input = $('input[name=admin_edit_option]:checked').val();
    var can_delete_acc_input = $('input[name=admin_delete_option]:checked').val();

    console.log(`Username: ${username_input}`);
    console.log(`Password: ${password_input}`);
    console.log(`Can_Create_Acc: ${can_create_acc_input}`);
    console.log(`Can_Edit_Acc: ${can_edit_acc_input}`);
    console.log(`Can_Delete_Acc: ${can_delete_acc_input}`);

    const url = `/Admin/CreateAdmin`;
    $.post(url, {
        username: username_input,
        password: password_input,
        can_create_acc: can_create_acc_input,
        can_edit_acc: can_edit_acc_input,
        can_delete_acc: can_delete_acc_input
    }).then(result => {
        console.log(`ServerReply CreateAdmin: ${result}`);
        location.reload();
    });

}

function SetStandorteBezirk() {
    console.log('enter SetStandorteBezirk');
    var bezirk_selected = $('#adminEdit_bezirk_select').val();
    console.log(`Selected Bezirk: ${bezirk_selected}`);

    const url = `/Admin/SetStandorteBezirkComboBox?bezirk=${bezirk_selected}`;
    $('#adminEdit_ort_select').load(url);

}

//FrageButtonFunctions
function FrageInfoClicked(event) {
    console.log('Frage InfoClicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetFrageInfo?frage_id=${id}`;
    $('#loadFrageModal').load(url, () => {
        $('#frageInfo_Modal').modal('show');
    });

}

function FrageEditClicked(event) {
    console.log('Frage EditClicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetFrageEdit?frage_id=${id}`;
    $('#loadFrageModal').load(url, () => {
        $('#frageEdit_Modal').modal('show');
        $('#saveFrageChanges').on('click', SaveFrageEdit);
    });

}

function FrageDeleteClicked(event) {
    console.log('Frage DeleteClicked');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    const url = `/Admin/GetFrageDelete?frage_id=${id}`;
    $('#loadFrageModal').load(url, () => {
        $('#frageDelete_Modal').modal('show');
        $('#deleteFrage').on('click', DeleteFrage);
    });

}

function SaveFrageEdit() {
    console.log('enter SaveFrageEdit');
    var frage_id_selected = $('#frageEdit_Id').text();
    console.log(`Selected Frage ID: ${frage_id_selected}`);
    var fragetext_change = $('#textarea_fragetext').val();

    const url = `/Admin/SaveFrageChanges`;
    $.post(url, {
        frage_id: frage_id_selected,
        fragetext: fragetext_change
    }).then(result => {
        console.log(`ServerReply SaveFrageChanges: ${result}`);
        location.reload();
    });



}

function CreateFrageClicked() {
    console.log('enter CreateFrageClicked');
    $('#frageCreate_Modal').modal('show');

}

function CreateFrage() {
    console.log('enter CreateFrage');
    var new_frage_text = $('#newFrage_Fragetext').val();

    const url = `/Admin/CreateFrage`;
    $.post(url, {
        fragetext: new_frage_text
    }).then(result => {
        console.log(`ServerReply CreateFrage: ${result}`);
        location.reload();
    });

}

function DeleteFrage() {
    console.log('enter DeleteFrage');
    //Nur Frage löschen --> wenn Frage in keiner aufgabe vorkommt
    //Was passiert mit aufgaben, die die Frage beinhalten???
    var frage_id_selected = $('#frage_id_delete').text();

    const url = `/Admin/DeleteFrage`;
    $.post(url, {
        frage_id: frage_id_selected
    }).then(result => {
        console.log(`ServerReply DeleteFrage: ${result}`);
        if (result === "ok") {
            location.reload();
        } else {
            //Frage darf nicht gelöscht werden --> Frage ist noch in einer Aufgabe vorhanden
            $('#frageDeleteError_Modal').modal('show');

        }

    });

}

function SelectFrage(event) {
    console.log('enter SelectFrage');
    var id = event.target.id;
    console.log(`Target_ID: ${id}`);

    $(`#li_${id}`).css("background-color", "green");

}

function SelectAntworttyp() {
    console.log('enter SelectAntworttyp');

    var selectedAntworttyp = $('#aufgabeEdit_antworttyp_select').val();
    console.log(`Selected Antworttyp: ${selectedAntworttyp}`);

    const url_getType = `/Admin/GetTypIdFromTyp`;
    $.post(url_getType, {
        typ: selectedAntworttyp
    }).then(result => {
        console.log(`ServerReply TypId: ${result}`);
        selectedAntworttyp = result;

        if (selectedAntworttyp != "noItemSelected") {

            var antwortLI_list = $('#antwortliste_aufgabeEditView').children();
            for (var i = 0; i < antwortLI_list.length; i++) {
                var antwort_li = antwortLI_list[i];
                var id_split = antwort_li.id.split("-");
                if (id_split[1] != selectedAntworttyp) {
                    $(`#${antwort_li.id}`).hide();
                } else {
                    $(`#${antwort_li.id}`).show();
                }
            }

        } else {
            var antwortLI_list = $('#antwortliste_aufgabeEditView').children();
            for (var i = 0; i < antwortLI_list.length; i++) {
                var antwort_li = antwortLI_list[i];
                $(`#${antwort_li.id}`).show();
            }

        }

    });


}

//AntwortButtonFunctions
function AntwortInfoClicked(event) {
    console.log('AntwortInfoClicked');
    var id_string = event.target.id;
    console.log(`Target_ID: ${id_string}`);
    var id = id_string.split("_");
    console.log(`Parameter ID: ${id[1]}`);

    const url = `/Admin/GetAntwortInfo?antwort_id=${id[1]}`;
    $('#loadAntwortModal').load(url, () => {
        $('#antwortInfo_Modal').modal('show');
    });

}

function AntwortEditClicked(event) {
    console.log('AntwortEditClicked');
    var id_string = event.target.id;
    console.log(`Target_ID: ${id_string}`);
    var id = id_string.split("_");
    console.log(`Parameter ID: ${id[1]}`);

    const url = `/Admin/GetAntwortEdit?antwort_id=${id[1]}`;
    $('#loadAntwortModal').load(url, () => {
        $('#antwortEdit_Modal').modal('show');

        //Events
        $('#antwortEditTypSelect').on('change', AntwortEditDialogTypeChanged);

        console.log('AntwortPartialView aufrufen');
        //Antwortteil Spezial laden
        const url2 = `/Admin/LoadAntwortEditAntwort?antwort_id=${id[1]}`;
        $('#partialViewAntworten').load(url2, () => {
            console.log('Load LoadAntwortEditAntwort');

            //Antwort speichern
            $('#saveAntwortChanges').on('click', SaveAntwortChanges);

            //Bei Auswahl des Typs ID Counter zurücksetzen

            id_cbEdit_AntwortRichtig = 100;
            id_cbEdit_AntwortFalsch = 100;
            id_rbEdit_AntwortFalsch = 100;

            //CB events editAntwortDialog
            $('#editAntwort_cbText_richtig_addCB').on('click', AddNewCBOption_RichtigeAntwortEdit);
            $('#editAntwort_cbText_falsch_addCB').on('click', AddNewCBOption_FalscheAntwortEdit);
            $('#editAntwort_cbText_richtig').on('click', DeleteItemOption_Antwort);
            $('#editAntwort_cbText_falsch').on('click', DeleteItemOption_Antwort);

            //RB events editAntwortDialog
            $('#editAntwort_rbText_falsch_addRB').on('click', AddNewRBOption_FalscheAntwortEdit);
            $('#editAntwort_rbText_falsch').on('click', DeleteItemOption_Antwort);

        });

    });

}

function AntwortDeleteClicked(event) {
    console.log('AntwortDeleteClicked');
    var id_string = event.target.id;
    console.log(`Target_ID: ${id_string}`);
    var id = id_string.split("_");
    console.log(`Parameter ID: ${id[1]}`);

    const url = `/Admin/GetAntwortDelete?antwort_id=${id[1]}`;
    $('#loadAntwortModal').load(url, () => {
        $('#antwortDelete_Modal').modal('show');
        $('#deleteAntwort').on('click', DeleteAntwort);
    });


}

function AntwortEditDialogTypeChanged() {
    var selected_Typ = $('#antwortEditTypSelect').val();
    console.log(`Changed Typ: ${selected_Typ}`);

    const url = `/Admin/SetNewAntwortType?typ_id=${selected_Typ}`;
    $('#partialViewAntworten').load(url, () => {

        //Bei Auswahl des Typs ID Counter zurücksetzen
        id_cbNew_AntwortRichtig = 1;
        id_cbNew_AntwortFalsch = 1;
        id_rbNew_AntwortFalsch = 1;

        editAntwortTypeChanged = true;

        //CB events newAntwortDialog
        $('#newAntwort_cbText_richtig_addCB').on('click', AddNewCBOption_RichtigeAntwortNew);
        $('#newAntwort_cbText_falsch_addCB').on('click', AddNewCBOption_FalscheAntwortNew);
        $('#newAntwort_cbText_richtig').on('click', DeleteItemOption_Antwort);
        $('#newAntwort_cbText_falsch').on('click', DeleteItemOption_Antwort);

        //RB events newAntwortDialog
        $('#newAntwort_rbText_falsch_addRB').on('click', AddNewRBOption_FalscheAntwortNew);
        $('#newAntwort_rbText_falsch').on('click', DeleteItemOption_Antwort);

    });

}

function DeleteAntwort() {
    console.log('enter DeleteAntwort');
    //Nur Antwort löschen --> wenn Antwort in keiner aufgabe vorkommt
    //Was passiert mit aufgaben, die die Antwort beinhalten???
    var antwort_id_selected = $('#antwort_id_delete').text();

    const url = `/Admin/DeleteAntwort`;
    $.post(url, {
        antwort_id: antwort_id_selected
    }).then(result => {
        console.log(`ServerReply DeleteAntwort: ${result}`);
        if (result === "ok") {
            location.reload();
        } else {
            //Antwort darf nicht gelöscht werden --> Antwort ist noch in einer Aufgabe vorhanden
            $('#antwortDeleteError_Modal').modal('show');

        }

    });

}

function DeleteAufgabe() {
    console.log('enter DeleteAufgabe');
    var aufgabe_id_selected = $('#aufgabe_id_delete').text();

    const url = `/Admin/DeleteAufgabe`;
    $.post(url, {
        aufgabe_id: aufgabe_id_selected
    }).then(result => {
        console.log(`ServerReply DeleteAufgabe: ${result}`);
        if (result === "ok") {
            location.reload();
        }

    });

}
//ARBEIT
function SaveAntwortChanges() {
    console.log('enter SaveAntwortChanges');
    var antwort_id = $('#antwortEdit_Id').text();
    var antwort_name = $('#antwortEdit_Antwortname').val();
    var selected_Typ_string = $('#antwortEditTypSelect').val();
    console.log('AntwortID: ' + antwort_id);
    console.log('AntwortName: ' + antwort_name);
    console.log('AntwortTyp: ' + selected_Typ_string);

    switch (selected_Typ_string) {
        case "A_T":
            if (editAntwortTypeChanged) {
                var antwort_text = $('#textfieldNewAntwortText').val();
                console.log(`Antwort Text: ${antwort_text}`);

                const url_textNew = `/Admin/EditNewAntwort_Text`;
                $.post(url_textNew, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    antwortText: antwort_text
                }).then(result => {
                    console.log(`ServerReply EditNewAntwort_Text: ${result}`);
                    location.reload();
                });
                break;
            } else {
                var antwort_text = $('#textfieldAntwortText').val();
                console.log(`Antwort Text: ${antwort_text}`);

                const url_textEdit = `/Admin/EditAntwort_Text`;
                $.post(url_textEdit, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    antwortText: antwort_text
                }).then(result => {
                    console.log(`ServerReply EditAntwort_Text: ${result}`);
                    location.reload();
                });
            }
            break;
        case "A_S":
            if (editAntwortTypeChanged) {
                var slider_min = $('#new_slider_min').val();
                var slider_max = $('#new_slider_max').val();
                var slider_sprungweite = $('#new_slider_sprungweite').val();
                var slider_rightVal = $('#new_slider_rightVal').val();
                var slider_titel = $('#new_slider_text').val();

                if (slider_titel == null) {
                    slider_titel = "";
                }

                console.log(`Werte: ${slider_min} + ${slider_max} + ${slider_sprungweite} + ${slider_rightVal} + ${slider_titel}`);

                const url_sliderNew = `/Admin/EditNewAntwort_Slider`;
                $.post(url_sliderNew, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    sliderMin: slider_min,
                    sliderMax: slider_max,
                    sliderSprungweite: slider_sprungweite,
                    sliderRightVal: slider_rightVal,
                    sliderTitel: slider_titel
                }).then(result => {
                    console.log(`ServerReply EditNewAntwort_Slider: ${result}`);
                    location.reload();
                });

            } else {
                var slider_min = $('#edit_slider_min').val();
                var slider_max = $('#edit_slider_max').val();
                var slider_sprungweite = $('#edit_slider_sprungweite').val();
                var slider_rightVal = $('#edit_slider_rightVal').val();
                var slider_titel = $('#edit_slider_text').val();

                if (slider_titel == null) {
                    slider_titel = "";
                }

                console.log(`Werte: ${slider_min} + ${slider_max} + ${slider_sprungweite} + ${slider_rightVal} + ${slider_titel}`);

                const url_sliderEdit1 = `/Admin/EditAntwort_Slider`;
                $.post(url_sliderEdit1, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    sliderMin: slider_min,
                    sliderMax: slider_max,
                    sliderSprungweite: slider_sprungweite,
                    sliderRightVal: slider_rightVal,
                    sliderTitel: slider_titel
                }).then(result => {
                    console.log(`ServerReply EditAntwort_Slider: ${result}`);
                    location.reload();
                });

            }
            break;
        case "A_DP":
            if (editAntwortTypeChanged) {
                var date_new = $('#newAntwortDatepicker').val();
                console.log('Datum: ' + date_new);

                const url_dateNew = `/Admin/EditNewAntwort_DP`;
                $.post(url_dateNew, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    date: date_new
                }).then(result => {
                    console.log(`ServerReply EditNewAntwort_DP: ${result}`);
                    location.reload();
                });
            } else {
                var date_edit = $('#datepickerEditAntwort').val();
                console.log('Datum: ' + date_edit);

                const url_dateEdit = `/Admin/EditAntwort_DP`;
                $.post(url_dateEdit, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    date: date_edit
                }).then(result => {
                    console.log(`ServerReply EditAntwort_DP: ${result}`);
                    location.reload();
                });
            }
            break;
        case "A_RB:T":
            if (editAntwortTypeChanged) {
                var right_option = $('#new_radiobuttons_rightVal').val();

                var wrong_options = new Array();
                var divs_falscheAntworten = $('#newAntwort_rbText_falsch').children();
                //console.log("Wrong Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_falscheAntworten.length; i++) {
                    var div = divs_falscheAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    wrong_options.push(input.value);
                }

                const url_RBNew = `/Admin/EditNewAntwort_RB`;
                $.post(url_RBNew, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    rightOption: right_option,
                    wrongOptions: wrong_options
                }).then(result => {
                    console.log(`ServerReply EditNewAntwort_RB: ${result}`);
                    location.reload();
                });
            } else {
                var right_option = $('#edit_radiobuttons_rightVal').val();

                var wrong_options = new Array();
                var divs_falscheAntworten = $('#editAntwort_rbText_falsch').children();
                //console.log("Wrong Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_falscheAntworten.length; i++) {
                    var div = divs_falscheAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    wrong_options.push(input.value);
                }

                const url_RBEdit = `/Admin/EditAntwort_RB`;
                $.post(url_RBEdit, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    rightOption: right_option,
                    wrongOptions: wrong_options
                }).then(result => {
                    console.log(`ServerReply EditAntwort_RB: ${result}`);
                    location.reload();
                });
            }
            break;
        case "A_CB:T":
            if (editAntwortTypeChanged) {
                var right_options = new Array();
                var divs_richtigeAntworten = $('#newAntwort_cbText_richtig').children();
                //console.log("Right Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_richtigeAntworten.length; i++) {
                    var div = divs_richtigeAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    right_options.push(input.value);
                }

                var wrong_options = new Array();
                var divs_falscheAntworten = $('#newAntwort_cbText_falsch').children();
                //console.log("Wrong Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_falscheAntworten.length; i++) {
                    var div = divs_falscheAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    wrong_options.push(input.value);
                }

                const url_CBNew = `/Admin/EditNewAntwort_CB`;
                $.post(url_CBNew, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    rightOptions: right_options,
                    wrongOptions: wrong_options
                }).then(result => {
                    console.log(`ServerReply EditNewAntwort_CB: ${result}`);
                    location.reload();
                });
            } else {
                var right_options = new Array();
                var divs_richtigeAntworten = $('#editAntwort_cbText_richtig').children();
                //console.log("Right Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_richtigeAntworten.length; i++) {
                    var div = divs_richtigeAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    right_options.push(input.value);
                }

                var wrong_options = new Array();
                var divs_falscheAntworten = $('#editAntwort_cbText_falsch').children();
                //console.log("Wrong Options: " + divs_richtigeAntworten.length);
                for (var i = 0; i < divs_falscheAntworten.length; i++) {
                    var div = divs_falscheAntworten[i].children;
                    var div_children = div[0].children;
                    var input = div_children[0];
                    console.log("Input: " + input.value);
                    wrong_options.push(input.value);
                }

                const url_CBEdit = `/Admin/EditAntwort_CB`;
                $.post(url_CBEdit, {
                    antwortId: antwort_id,
                    antwortName: antwort_name,
                    antwortTyp: selected_Typ_string,
                    rightOptions: right_options,
                    wrongOptions: wrong_options
                }).then(result => {
                    console.log(`ServerReply EditAntwort_CB: ${result}`);
                    location.reload();
                });
            }
            break;
        default:
            console.log('Keine Antwort zum Speichern');

    }

}

function CreateAntwortClicked() {
    console.log('enter AntwortNewClicked');
    $('#antwortCreate_Modal').modal('show');
}

function AntwortNewDialogTypeChanged() {
    var selected_Typ = $('#antwortTypSelectNew').val();
    console.log(`Changed Typ: ${selected_Typ}`);

    const url = `/Admin/SetNewAntwortType?typ_id=${selected_Typ}`;
    $('#partialViewAntwortenNew').load(url, () => {

        //Bei Auswahl des Typs ID Counter zurücksetzen
        id_cbNew_AntwortRichtig = 1;
        id_cbNew_AntwortFalsch = 1;
        id_rbNew_AntwortFalsch = 1;

        //CB events newAntwortDialog
        $('#newAntwort_cbText_richtig_addCB').on('click', AddNewCBOption_RichtigeAntwortNew);
        $('#newAntwort_cbText_falsch_addCB').on('click', AddNewCBOption_FalscheAntwortNew);
        $('#newAntwort_cbText_richtig').on('click', DeleteItemOption_Antwort);
        $('#newAntwort_cbText_falsch').on('click', DeleteItemOption_Antwort);

        //RB events newAntwortDialog
        $('#newAntwort_rbText_falsch_addRB').on('click', AddNewRBOption_FalscheAntwortNew);
        $('#newAntwort_rbText_falsch').on('click', DeleteItemOption_Antwort);

    });
}

function CreateAntwort() {
    console.log('enter CreateAntwort');

    var antwort_name = $('#antwortNew_AntwortnameNew').val();
    var selected_Typ_string = $('#antwortTypSelectNew').val();

    console.log(`Selected Typ: ${selected_Typ_string}`);
    console.log(`Antwortname: ${antwort_name}`);

    switch (selected_Typ_string) {
        case "A_T":
            var antwort_text = $('#textfieldNewAntwortText').val();
            console.log(`Antwort Text: ${antwort_text}`);

            const url_text = `/Admin/CreateAntwort_Text`;
            $.post(url_text, {
                antwortName: antwort_name,
                antwortTyp: selected_Typ_string,
                antwortText: antwort_text
            }).then(result => {
                console.log(`ServerReply CreateAntwort_Text: ${result}`);
                location.reload();
            });
            break;
        case "A_S":
            var slider_min = $('#new_slider_min').val();
            var slider_max = $('#new_slider_max').val();
            var slider_sprungweite = $('#new_slider_sprungweite').val();
            var slider_rightVal = $('#new_slider_rightVal').val();
            var slider_titel = $('#new_slider_text').val();

            if (slider_titel == null) {
                slider_titel = "";
            }

            console.log(`Werte: ${slider_min} + ${slider_max} + ${slider_sprungweite} + ${slider_rightVal} + ${slider_titel}`);

            const url_slider = `/Admin/CreateAntwort_Slider`;
            $.post(url_slider, {
                antwortName: antwort_name,
                antwortTyp: selected_Typ_string,
                sliderMin: slider_min,
                sliderMax: slider_max,
                sliderSprungweite: slider_sprungweite,
                sliderRightVal: slider_rightVal,
                sliderTitel: slider_titel
            }).then(result => {
                console.log(`ServerReply CreateAntwort_Slider: ${result}`);
                location.reload();
            });
            break;
        case "A_DP":
            var date = $('#newAntwortDatepicker').val();

            console.log(`New Date: ${date}`);

            const url_DP = `/Admin/CreateAntwort_DP`;
            $.post(url_DP, {
                antwortName: antwort_name,
                antwortTyp: selected_Typ_string,
                date: date
            }).then(result => {
                console.log(`ServerReply CreateAntwort_DP: ${result}`);
                location.reload();
            });
            break;
        case "A_RB:T":
            var right_option = $('#new_radiobuttons_rightVal').val();

            var wrong_options = new Array();
            var divs_falscheAntworten = $('#newAntwort_rbText_falsch').children();
            //console.log("Right Options: " + divs_richtigeAntworten.length);
            for (var i = 0; i < divs_falscheAntworten.length; i++) {
                var div = divs_falscheAntworten[i].children;
                var div_children = div[0].children;
                var input = div_children[0];
                console.log("Input: " + input.value);
                wrong_options.push(input.value);
            }

            const url_RB = `/Admin/CreateAntwort_RB`;
            $.post(url_RB, {
                antwortName: antwort_name,
                antwortTyp: selected_Typ_string,
                rightOption: right_option,
                wrongOptions: wrong_options
            }).then(result => {
                console.log(`ServerReply CreateAntwort_RB: ${result}`);
                location.reload();
            });
            break;
        case "A_CB:T":
            var right_options = new Array();
            var divs_richtigeAntworten = $('#newAntwort_cbText_richtig').children();
            //console.log("Right Options: " + divs_richtigeAntworten.length);
            for (var i = 0; i < divs_richtigeAntworten.length; i++) {
                var div = divs_richtigeAntworten[i].children;
                var div_children = div[0].children;
                var input = div_children[0];
                console.log("Input: " + input.value);
                right_options.push(input.value);
            }

            var wrong_options = new Array();
            var divs_falscheAntworten = $('#newAntwort_cbText_falsch').children();
            //console.log("Right Options: " + divs_richtigeAntworten.length);
            for (var i = 0; i < divs_falscheAntworten.length; i++) {
                var div = divs_falscheAntworten[i].children;
                var div_children = div[0].children;
                var input = div_children[0];
                console.log("Input: " + input.value);
                wrong_options.push(input.value);
            }

            const url_CB = `/Admin/CreateAntwort_CB`;
            $.post(url_CB, {
                antwortName: antwort_name,
                antwortTyp: selected_Typ_string,
                rightOptions: right_options,
                wrongOptions: wrong_options
            }).then(result => {
                console.log(`ServerReply CreateAntwort_CB: ${result}`);
                location.reload();
            });
            break;
        default:
            console.log('Keine Antwort zum Speichern');
            break;
    }

}

function ZusatzInfo_InfoClicked(event) {
    console.log('ZusatzInfo_InfoClicked');
    var id_string = event.target.id;
    console.log(`Target_ID: ${id_string}`);
    var id = id_string.split("_");
    console.log(`Parameter ID: ${id[1]}`);

    const url = `/Admin/GetZusatzInfo_Info?info_id=${id[1]}`;
    $('#loadZusatzInfoModal').load(url, () => {
        $('#zusatzInfoInfo_Modal').modal('show');
    });
}

function ZusatzInfo_DeleteClicked(event) {

    console.log('ZusatzInfo_DeleteClicked');
    var id_string = event.target.id;
    console.log(`Target_ID: ${id_string}`);
    var id = id_string.split("_");
    console.log(`Parameter ID: ${id[1]}`);

    const url = `/Admin/GetZusatzInfoDelete?info_id=${id[1]}`;
    $('#loadZusatzInfoModal').load(url, () => {
        $('#zusatzInfoDelete_Modal').modal('show');
        $('#deleteZusatzInfo').on('click', DeleteZusatzInfo);
    });


}

function DeleteZusatzInfo() {
    console.log('enter DeleteZusatzInfos');
    //Nur Zusatzinfo löschen --> wenn ZusatzInfo in keiner aufgabe vorkommt
    //Was passiert mit aufgaben, die die ZusatzInfo beinhalten???
    var info_id_selected = $('#zusatzInfo_id_delete').text();

    const url = `/Admin/DeleteZusatzInfo`;
    $.post(url, {
        info_id: info_id_selected
    }).then(result => {
        console.log(`ServerReply DeleteZusatzInfo: ${result}`);
        if (result === "ok") {
            location.reload();
        } else {
            //ZusatzInfo darf nicht gelöscht werden --> ZusatzInfo ist noch in einer Aufgabe vorhanden
            $('#zusatzInfoDeleteError_Modal').modal('show');

        }

    });

}

function AddNewCBOption_RichtigeAntwortNew() {
    console.log('enter AddNewCBOption_RichtigeAntwortNew');
    id_cbNew_AntwortRichtig++;
    $('#newAntwort_cbText_richtig').append(
        `
        <div id="newAntwort_cbText_richtig_${id_cbNew_AntwortRichtig}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Richtige Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger delete_CB_richtig_AntwortNeu" id="btn_newAntwort_cbText_richtig_${id_cbNew_AntwortRichtig}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );

}

function AddNewCBOption_FalscheAntwortNew() {
    console.log('enter AddNewCBOption_FalscheAntwortNew');
    id_cbNew_AntwortFalsch++;
    $('#newAntwort_cbText_falsch').append(
        `
        <div id="newAntwort_cbText_falsch_${id_cbNew_AntwortFalsch}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Falsche Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger delete_CB_falsch_AntwortNeu" id="btn_newAntwort_cbText_falsch_${id_cbNew_AntwortFalsch}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );

}

function AddNewRBOption_FalscheAntwortNew() {
    console.log('enter AddNewRBOption_FalscheAntwortNew');
    id_rbNew_AntwortFalsch++;
    $('#newAntwort_rbText_falsch').append(
        `
        <div id="newAntwort_rbText_falsch_${id_rbNew_AntwortFalsch}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Falsche Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger delete_RB_falsch_AntwortNeu" id="btn_newAntwort_rbText_falsch_${id_rbNew_AntwortFalsch}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );

}

function AddNewCBOption_RichtigeAntwortEdit() {
    console.log('enter AddNewCBOption_RichtigeAntwortEdit');
    id_cbEdit_AntwortRichtig++;
    $('#editAntwort_cbText_richtig').append(
        `
        <div id="editAntwort_cbText_richtig_${id_cbEdit_AntwortRichtig}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Richtige Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger" id="btn_editAntwort_cbText_richtig_${id_cbEdit_AntwortRichtig}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );

}

function AddNewCBOption_FalscheAntwortEdit() {
    console.log('enter AddNewCBOption_FalscheAntwortEdit');
    id_cbEdit_AntwortFalsch++;
    $('#editAntwort_cbText_falsch').append(
        `
        <div id="editAntwort_cbText_falsch_${id_cbEdit_AntwortFalsch}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Falsche Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger" id="btn_editAntwort_cbText_falsch_${id_cbEdit_AntwortFalsch}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );

}

function AddNewRBOption_FalscheAntwortEdit() {
    console.log('enter AddNewRBOption_FalscheAntwortEdit');
    id_rbEdit_AntwortFalsch++;
    $('#editAntwort_rbText_falsch').append(
        `
        <div id="editAntwort_rbText_falsch_${id_rbEdit_AntwortFalsch}">
        <div>
            <input style="margin-bottom: 5px; float:left;" placeholder="Falsche Antwort eingeben" class="form-control input-field" type="text" />
            <button class="btn btn-danger" id="btn_editAntwort_rbText_falsch_${id_rbEdit_AntwortFalsch}"><span class="glyphicon glyphicon-remove"></span></button>
        </div> <br />
            </div>
        `
    );
}

function DeleteItemOption_Antwort(event) {
    console.log('enter DeleteNewCBOption_RichtigeAntwortNew');
    console.log(`Target ID BTN delete: ${event.target.id}`);
    var button_id = event.target.id;
    if (button_id.startsWith('btn_')) {
        var div_id = button_id.replace('btn_', '');
        console.log(`Edited String: ${div_id}`);
        $(`#${div_id}`).remove();
    }
}




