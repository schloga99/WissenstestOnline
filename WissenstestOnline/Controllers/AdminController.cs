﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DB_lib;
using Microsoft.Extensions.Logging;
using DB_lib.Tables;
using WissenstestOnlineWebseite.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using WissenstestOnlineWebseite.AdminModels;

namespace WissenstestOnline.Controllers
{
    public class AdminController : Controller
    {

        private TestDB_Context test_db;
        private ILogger<MainController> logger;

        public AdminController(TestDB_Context db, ILogger<MainController> logger)
        {
            this.test_db = db;
            this.logger = logger;
        }

        //Admin Login Page
        public IActionResult Login(){
            logger.LogInformation("Testlog Admincontroller");
            return View();
        }


        public IActionResult AdminOverview()
        {
            //Alle Aufgaben holen und in Model speichern
            List<Aufgabe> alle_aufgaben = test_db.Aufgaben.Select(x => x).OrderBy(x => x.Station.Station_Id).ToList();
            var adminOverwiew_model = new AdminOverview_Model();
            adminOverwiew_model.Aufgaben = alle_aufgaben;

            //Stationen als SelectListItems umwandeln und in Model speichern
            List<Station> stations = test_db.Stationen.OrderBy(x => x.Station_Id).ToList();
            List<SelectListItem> stationsList = new List<SelectListItem>();
            stationsList.Add(new SelectListItem { Text = "keine ausgewählt", Value = "noItemSelected"});
            foreach (Station s in stations)
            {
                SelectListItem stationItem = new SelectListItem { Text = s.Stationsname, Value = s.Station_Id.ToString() };
                stationsList.Add(stationItem);
            }
            adminOverwiew_model.Stationen = stationsList;

            //Admins holen und in Model speichern + Modelübergabe an View
            List<Admintable> alle_admins = test_db.Admins.Select(x => x).OrderBy(x => x.Username).ToList();
            adminOverwiew_model.Admins = alle_admins;

            //Aktuellen Admin holen

            return View(adminOverwiew_model);

        }

        public IActionResult AufgabeEditView(int aufgabe_id)
        {
            logger.LogInformation("Selected Aufgabe ID: " + aufgabe_id);



            //Stationen
            List<Station> stations = test_db.Stationen.OrderBy(x => x.Station_Id).ToList();
            List<SelectListItem> stationsList = new List<SelectListItem>();
            foreach (Station s in stations)
            {
                SelectListItem stationItem = new SelectListItem { Text = s.Stationsname, Value = s.Station_Id.ToString() };
                stationsList.Add(stationItem);
            }

            //Bezirke
            List<Bezirk> bezirke = test_db.Bezirke.OrderBy(x => x.Bezirksname).ToList();
            List<SelectListItem> bezirkeList = new List<SelectListItem>();
            foreach (Bezirk b in bezirke)
            {
                SelectListItem bezirkItem = new SelectListItem { Text = b.Bezirksname, Value = b.Bezirksname };
                bezirkeList.Add(bezirkItem);
            }

            var aufgabe_view_Model = new AufgabeEditView_Model();

            aufgabe_view_Model.Stationen = stationsList;
            aufgabe_view_Model.Bezirke = bezirkeList;


            var aufgabeInfo_edit_Model = FillAufgabeModel(aufgabe_id);

            var aufgabe_edit_main_Model = new AufgabeEditMain_Model();
            aufgabe_edit_main_Model.AufgabeInfo_Model = aufgabeInfo_edit_Model;
            aufgabe_edit_main_Model.AufgabeEditView_Model = aufgabe_view_Model;
            return View(aufgabe_edit_main_Model);
        }

        public IActionResult Logout()
        {

            return RedirectToAction("Start", "Main");
        }


        //Ajax calls
        public string CheckAdminInfo(string username, string password) {

            Admintable admin =  test_db.Admins.SingleOrDefault(x => x.Username.Equals(username));
            if (admin == null)
            {
                return "username_fail";
            }
            else if (!admin.Password.Equals(password))
            {
                return "password_fail";
            }
            else {
                return "ok";
            }
        }

        public IActionResult GetAdminInfo(string admin_id) {
            int adminId_int = Convert.ToInt32(admin_id);
            var adminInfo_model = FillAdminModel(adminId_int);
            return PartialView("Modal_PartialViews/AdminInfo_Modal", adminInfo_model);
        }

        public IActionResult GetAdminEdit(string admin_id) {
            int adminId_int = Convert.ToInt32(admin_id);
            var adminInfo_model = FillAdminModel(adminId_int);
            return PartialView("Modal_PartialViews/AdminEdit_Modal", adminInfo_model);
        }

        public IActionResult GetAdminDelete(string admin_id) {
            int adminId_int = Convert.ToInt32(admin_id);
            var adminInfo_model = FillAdminModel(adminId_int);
            return PartialView("Modal_PartialViews/AdminDelete_Modal", adminInfo_model);
        }

        public IActionResult GetAufgabeInfo(string aufgabe_id) {
            int aufgabeId_int = Convert.ToInt32(aufgabe_id);
            var aufgabeInfo_model = FillAufgabeModel(aufgabeId_int);
            return PartialView("Modal_PartialViews/AufgabeInfo_Modal", aufgabeInfo_model);
        }

        public AdminInfo_Model FillAdminModel(int adminId_int) {
            
            Admintable admin = test_db.Admins.Single(x => x.Admin_Id == adminId_int);
            var adminInfo_model = new AdminInfo_Model();
            adminInfo_model.Id = admin.Admin_Id;
            adminInfo_model.Username = admin.Username;
            adminInfo_model.Password = admin.Password;
            adminInfo_model.Can_create_acc = admin.Can_create_acc;
            adminInfo_model.Can_edit_acc = admin.Can_edit_acc;
            adminInfo_model.Can_delete_acc = admin.Can_delete_acc;
            return adminInfo_model;
        }

        public AufgabeInfo_Model FillAufgabeModel(int aufgabeId_int) {
            Aufgabe aufgabe = test_db.Aufgaben.Single(x => x.Aufgabe_Id == aufgabeId_int);
            var aufgabeInfo_model = new AufgabeInfo_Model();
            aufgabeInfo_model.Aufgabe_Id = aufgabe.Aufgabe_Id;
            aufgabeInfo_model.Station = aufgabe.Station.Stationsname;
            aufgabeInfo_model.Stufe = aufgabe.Stufe.Stufenname;
            aufgabeInfo_model.IsPflichtaufgabe = aufgabe.Pflichtaufgabe;
            aufgabeInfo_model.Bezirk = aufgabe.AufgabeBezirk == null ? "-" : aufgabe.AufgabeBezirk;
            aufgabeInfo_model.Ort = aufgabe.AufgabeOrt == null ? "-" : aufgabe.AufgabeOrt;
            aufgabeInfo_model.TeilAufgabeVon = aufgabe.TeilaufgabeVon == null ? "-" : aufgabe.TeilaufgabeVon.Aufgabe_Id.ToString();

            aufgabeInfo_model.Frage = aufgabe.Frage;

            aufgabeInfo_model.Info = aufgabe.Zusatzinfo.InfoContentM;


            //Antwort
            string aufgabe_typ = aufgabe.Antwort.Typ.Typ;
            int aufgabe_inhalt_id = aufgabe.Antwort.Inhalt_Id;

            switch (aufgabe_typ) {
                case "A_T":
                    aufgabeInfo_model.Antworttyp = "Text";
                    aufgabeInfo_model.Antwort_Text = test_db.Antwort_Texte.Single(x => x.Inhalt_Id == aufgabe_inhalt_id);
                    break;
                case "A_S":
                    aufgabeInfo_model.Antworttyp = "Slider";
                    aufgabeInfo_model.Antwort_Slider = test_db.Antwort_Sliders.Single(x => x.Inhalt_Id == aufgabe_inhalt_id);
                    break;
                case "A_DP":
                    aufgabeInfo_model.Antworttyp = "DatePicker";
                    aufgabeInfo_model.Antwort_DatePicker = test_db.Antwort_DatePickerM.Single(x => x.Inhalt_Id == aufgabe_inhalt_id);
                    break;
                case "A_CB:T":
                    aufgabeInfo_model.Antworttyp = "CheckBox";
                    aufgabeInfo_model.Antwort_CheckBoxes = test_db.Antwort_CheckBoxes.Single(x => x.Inhalt_Id == aufgabe_inhalt_id).CheckBoxes;
                    break;
                case "A_RB:T":
                    aufgabeInfo_model.Antworttyp = "RadioButton";
                    aufgabeInfo_model.Antwort_RadioButtons = test_db.Antwort_RadioButtons.Single(x => x.Inhalt_Id == aufgabe_inhalt_id).RadioButtons;
                    break;
            }

            return aufgabeInfo_model;
        }

        public string SaveAdminChanges(int admin_id, string username,string password, bool can_create_acc, bool can_edit_acc, bool can_delete_acc) {
            //Datenbankänderungen u Überprüfungen
            var edit_admin = test_db.Admins.Single(x => x.Admin_Id == admin_id);
            edit_admin.Username = username;
            edit_admin.Password = password;
            edit_admin.Can_create_acc = can_create_acc;
            edit_admin.Can_edit_acc = can_edit_acc;
            edit_admin.Can_delete_acc = can_delete_acc;
            test_db.SaveChanges();
            return "ok";
        }

        public string DeleteAdmin(int admin_id) {
            //Datensatz löschen
            var delete_admin = test_db.Admins.Single(x => x.Admin_Id == admin_id);
            test_db.Admins.Remove(delete_admin);
            test_db.SaveChanges();
            return "ok";
        }

        public string CreateAdmin(string username, string password, bool can_create_acc, bool can_edit_acc, bool can_delete_acc) {
            Admintable new_admin = new Admintable();
            new_admin.Username = username;
            new_admin.Password = password;
            new_admin.Can_create_acc = can_create_acc;
            new_admin.Can_edit_acc = can_edit_acc;
            new_admin.Can_delete_acc = can_delete_acc;
            test_db.Admins.Add(new_admin);
            test_db.SaveChanges();
            return "ok";
        }



    }
}
