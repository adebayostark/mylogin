// type of accounts just basically Operators(mtn, glo etc) and staff
const authorizedUser = {
    user1: ['MTN', 'Operator'],
    user2: ['GLO', 'Operator'],
    user3: ['9MOBILE','Operator'],
    user4: ['AIRTEL','Operator'],
    staff: ['ZYSOD','Staff']
};
// operator colored map markers
const operatorColor = {
    user1: '/static/img/marker-icon-mtn.png', //MTN
    user2: '/static/img/marker-icon-glo.png', //glo
    user3: '/static/img/marker-icon-9mobile.png', //9mobile
    user4: '/static/img/marker-icon-airtel.png' //airtel
}
// for staff to match with network operator from the json file homedata.json
const operatorStaffColor = {
    'MTN': '/static/img/marker-icon-mtn.png', //MTN
    'GLO': '/static/img/marker-icon-glo.png', //glo
    '9MOBILE': '/static/img/marker-icon-9mobile.png', //9mobile
    'AIRTEL': '/static/img/marker-icon-airtel.png' //airtel
}
// get information from the url whether it is an operator or a staff
var enteredURL = window.location.pathname;
var user = enteredURL.slice(4, (enteredURL.length)+1); // get the actual value after slicing

const this_page = window.location.href,
      voltage_threshold = 20;
let locations = [],
    active_sites = 0,
    terminations = 0,
    availability = 0,
    number_of_mtn = 0, 
    number_of_9mobile = 0,
    number_of_airtel = 0,
    number_of_glo = 0,    
    list_button = document.getElementById("list-button"), 
    map_button = document.getElementById("map-button"), 
    map_card = document.getElementById("map-card"), 
    list_card = document.getElementById("list-card");

    function populateViews(){
        let t_table = document.getElementById("site_list");
        let mymap = L.map("map-view", {
            doubleClickZoom:!1,
            closePopupOnClick:!1            
        }).setView([9.367231, 7.765842], 6); // set the default view and zoom level
        
        L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", { // used to get the map images
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors' // important 
        }).addTo(mymap); // add the map to be created         
        var markers = new L.markerClusterGroup({spiderfyOnMaxZoom: false,  showCoverageOnHover: false, zoomToBoundsOnClick: false});
        var markerList = [];// for cluster
        
        // for map search still undone by me
        var markersLayer = new L.LayerGroup();
        mymap.addLayer(markersLayer);
        var controlSearch = new L.Control.Search({
            position:'topleft',		
            layer: markersLayer,
            initial: false,
            zoom: 12,
            marker: false
        });
       mymap.addControl( controlSearch );
    //    end of map search

        for (var i = 0; i < locations.length; i++) {
            let index = i + 1,
            voltage = locations[i].deployment_type.startsWith("david") ? parseFloat(locations[i].working_parameters.dc_module_output_voltage) : parseFloat(locations[i].working_parameters.battery_voltage),
            t_row = document.createElement("tr"), // a table is already present in the html, then create a row
            t_data = "<td>" + index + '</td><td style="width: 300px; text-transform: capitalize"><a href="' // data to be added to the row
                     + '/us/sites/'+ locations[i].name.toLowerCase() + '">' + locations[i].name + "</a></td><td>" + locations[i].latitude
                      + "°</td><td>" + locations[i].longitude + "°</td><td>" + locations[i].date_registered + '</td><td id="lstatus_' + locations[i].name +'">'+ addListStatus(voltage, locations[i].name) +'</td>';             
            t_row.innerHTML = t_data, // add the data to the created row
            t_table.appendChild(t_row); // append the table 
            if(locations[i].working_parameters.dc_module_output_voltage > 20){
                active_sites += 1;
            }
            //  to get the new of sites for each network
            if(locations[i].network_operator === 'MTN'){
                number_of_mtn +=1
            }
            if(locations[i].network_operator === 'GLO'){
                number_of_glo +=1
            }
            if(locations[i].network_operator === '9MOBILE'){
                number_of_9mobile +=1
            }
            if(locations[i].network_operator === 'AIRTEL'){
                number_of_airtel +=1
            }
            // end 

            terminations += locations[i].working_parameters.terminations
            availability += locations[i].availability

            let status =`<article class="message"><div class="message-header"><p style="text-transform: capitalize;">${locations[i].name}</p>
                         <span id="mstatus_"${addMapStatus(voltage, locations[i].name)}></span></span></div>
                         <div class="message-body"><table class="table is-stripped is-hoverable"><tbody>
                         <tr><td>Availability</td><td>${locations[i].availability}%</td></tr>
                         <tr><td>Total Call Duration</td><td>-- </td></tr>
                         <tr><td>Total Subscriber Terminations</td><td>--</td></tr>
                         <tr><td>Total Data Traffic</td><td>--</td></tr></tbody></table>
                         <nav class="level"><div class="level-left"></div>
                         <div class="level-right"><a href="/us/sites/${locations[i].name.toLowerCase()}">View Site for more details</a></div>
                         </nav></div></article>`  
                         var operatorIcon = new L.Icon({ 
                            iconUrl: operatorColor[user], 
                            shadowUrl: '/static/img/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            labelAnchor: [6, 0],
                            shadowSize: [41, 41]
                          });
                        

            if(authorizedUser[user][1] ==='Operator'){
                document.getElementById('total_sites').innerHTML = locations.length;
                document.getElementById('active_sites').innerHTML = active_sites;
                document.getElementById('total_subscriber').innerHTML = terminations;
                document.getElementById('total_availability').innerHTML = `${(availability/locations.length).toFixed(2)}%`;
                }else{
                operatorIcon.options.iconUrl=operatorStaffColor[locations[i].network_operator];
                document.getElementById('total_sites').innerHTML = locations.length;
                document.getElementById('active_sites').innerHTML = active_sites;
                document.getElementById('total_subscriber').innerHTML = terminations;
                document.getElementById('total_availability').innerHTML = `${(availability/locations.length).toFixed(2)}%`;
               }
               markers.addLayer(L.marker([locations[i].latitude,locations[i].longitude], {icon: operatorIcon})
                           .bindPopup(status, {
                          autoClose: !1, 
                          closeButton: !1, 
                          maxWidth: 560
                      }));
                      
                     
         }
        //  for the 4 panels that will be visible to only admin. 
         if(authorizedUser[user][1] ==='Staff'){
            let adminpanel =
            `<div class="columns"><div class="column"><div class="card"><div class="staff-group">
             <img src="/static/img/mtn-logo.png" alt=""><div class="right-pane">${number_of_mtn}</div></div></div></div>
             <div class="column"><div class="card"><div class="staff-group"><img src="/static/img/glo-logo.gif" alt="">
             <div class="right-pane">${number_of_glo}</div></div></div></div>
             <div class="column"><div class="card"><div class="staff-group"><img src="/static/img/airtel-logo.png" alt="">
             <div class="right-pane">${number_of_airtel}</div></div></div></div>
            <div class="column"><div class="card"><div class="staff-group"><img src="/static/img/9mobile.jpg" alt="">
            <div class="right-pane">${number_of_9mobile}</div></div></div></div></div>`
            $('#operators').next().empty();
            $('#operators').append(adminpanel);
         }
        //  end 



        mymap.addLayer(markers); 
        // event for clusters    
        markers.on('clusterclick', function (a) {           
			a.layer.spiderfy(); 
        });
       
    }

    function addMapStatus(voltage, name){
        if(voltage>voltage_threshold){
            //return `<div class="centralize"><div id="mstatus_' class="site-status"></div>`
            return "class='site-status'"
        }else{            
           return "class='fa fa-warning alarm'"
           //return `<div class="centralize"><div id="mstatus_' class="fa fa-warning alarm"></div>`
        }
    }
    function addListStatus(voltage, name){
        if(voltage>voltage_threshold){            
           return '<div class="site-status"></div><span style="color: lime"> Running</span>';
    }else{
        return '<span class="icon"><i class="fa fa-warning"></i></span><span style="color: red;">Down</span>';
    }
}
    


/// for fetch api
function fetchData(){
    axios.get('/static/js/homedata.json').then(response=>{
      var initData = response.data.sites; 
        

       if(authorizedUser[user][1] === 'Operator'){
           for(let i=0;i<initData.length;i++){
            if(initData[i].network_operator == authorizedUser[user][0]){
                locations.push(initData[i]);
            }
           }
           
        //$('#status').empty();
        
    }else{
        locations = initData;
        //$('#status').empty();        
        
    }      
       populateViews()
    }).catch(error=>{
        console.log(error)
    })
}





    function activator() {
        for (let i = 0; i < tabs.length; i++) tabs[i].classList.contains("is-active") && tabs[i].classList.remove("is-active");
        tabs[1].classList.add("is-active")
    }
    document.addEventListener("DOMContentLoaded", activator), toastr.options = {
        closeButton: !0,
        debug: !1,
        newestOnTop: !1,
        progressBar: !1,
        positionClass: "toast-top-center",
        preventDuplicates: !0,
        onclick: null,
        showDuration: "100",
        hideDuration: "2000",
        timeOut: "8000",
        extendedTimeOut: "2000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }, 
    map_button.addEventListener("click", () => {
        list_card.style.display = "none",
        list_button.classList.remove("is-link"),
         map_card.style.display = "block", map_button.classList.add("is-link")
    }), 
    list_button.addEventListener("click", () => {
        map_card.style.display = "none",
        map_button.classList.remove("is-link"), 
        list_card.style.display = "block", 
        list_button.classList.add("is-link")
    }), fetchData(), socket.on("all_sites", function(data) {
        statusify(data.voltage, data.name)
    });