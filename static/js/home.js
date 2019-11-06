const authorizedUser = {
    user1: ['MTN', 'Operator'],
    user2: ['GLO', 'Operator'],
    user3: ['9MOBILE','Operator'],
    user4: ['AIRTEL','Operator'],
    staff: ['ZYSOD','Staff']
};
const authorizedBorderedColor = {
    'MTN': 'is-mtn',
    '9MOBILE': 'is-9mobile',
    'AIRTEL': 'is-airtel',
    'GLO': 'is-glo'
    
};
var enteredURL = window.location.pathname,
 user = enteredURL.slice(14, (enteredURL.length)+1); 
   
var list_button = document.getElementById("list-button"), 
map_button = document.getElementById("map-button"), 
map_card = document.getElementById("map-card"), 
list_card = document.getElementById("list-card"),
locations =[],
main_set = [],
offline =[],
online = [],
searched = [],
summary = [];
fetchData();


map_button.addEventListener("click", () => {
    list_card.style.display = "none",
    list_button.classList.remove("is-link"),
    map_card.style.display = "block",
    map_button.classList.add("is-link")
    $('#dash-table').DataTable().destroy()
});
list_button.addEventListener("click", () => {
    map_card.style.display = "none",
    map_button.classList.remove("is-link"), 
    list_card.style.display = "block", 
    list_button.classList.add("is-link")
    $('#dash-table').DataTable({paging: false,bFilter: false,ordering: false,searching: true,dom: 't'});
});

// to fetch data
function fetchData(){
    axios.get('/static/js/overall.json').then(response=>{
        var initData = response.data.sites;
        var initSummary = response.data.summary
        if(authorizedUser[user][1] === "Operator"){
            for(let i=0;i<initData.length;i++){
                if(initData[i].network_operator == authorizedUser[user][0]){
                    locations.push(initData[i]);
                }
            }
        for(let i=0;i<initSummary.length;i++){
            if(initSummary[i].network_operator == authorizedUser[user][0]){                    
                summary.push(initSummary[i]);
               }
            }
        }else{
            locations = initData
            summary = initSummary
        }
        locations.forEach((x)=>{
            if(x.working_parameters.dc_module_output_voltage > 20){
                online.push(x);
            }else{
                offline.push(x);
            }
        });
        
        populateViews()
           
        }).catch(error=>{
            console.log(error)
        })
    }
// to populate the total sites, bandwidth, etc
function populateViews(){
        
        if(authorizedUser[user][1] === "Operator"){
            document.getElementById('total_sites').innerHTML = summary[0].total_sites;
            document.getElementById('total_terminations').innerHTML = summary[0].total_subscriber_terminations
            document.getElementById('call_duration').innerHTML = summary[0].total_call_duration
            document.getElementById('bandwidth').innerHTML = summary[0].total_bandwidth

            populateCard();
        }
        if(authorizedUser[user][1] === "Staff"){
            let total_sites = 0, total_subscriber_terminations=0, total_call_duration=0, total_bandwidth=0;
            for(let i=0;i<summary.length;i++){
                total_sites += summary[i].total_sites;
                total_bandwidth +=summary[i].total_bandwidth;
                total_subscriber_terminations +=summary[i].total_subscriber_terminations;
                total_call_duration += summary[i].total_call_duration
            }
            document.getElementById('total_sites').innerHTML = total_sites;
            document.getElementById('total_terminations').innerHTML = total_subscriber_terminations
            document.getElementById('call_duration').innerHTML = total_call_duration.toFixed(4)
            document.getElementById('bandwidth').innerHTML = total_bandwidth.toFixed(4);
          
             populateCard();
        }

        for(let i=0;i<locations.length;i++){

            let t_row = document.createElement('tr'),
                voltage =  locations[i].working_parameters.dc_module_output_voltage > 20 ? '/static/img/OnlineState_Online.png':'/static/img/OnlineState_Offline.png',
            t_data = `<td>
            <img src=${voltage} width="30">
          </td>
          <td style="text-transform: capitalize"><a href="/us/sites/${locations[i].name}">${locations[i].name}</td>
          <td class="green-param">${locations[i].availability}%</td>
          <td class="red-param">${locations[i].working_parameters.bandwidth}</td>
          <td class="red-param">${locations[i].working_parameters.voice_traffic}</td>
          <td class="red-param">${locations[i].working_parameters.terminations}</td>`
          t_row.innerHTML = t_data;
          document.getElementById('status').appendChild(t_row);

         
        }
    }
// to add cards showing all the sites and four parameters
function populateCard(){   
    
    for(let i=0;i<locations.length;i++){           
        let voltage =  locations[i].working_parameters.dc_module_output_voltage > 20 ? 'class="site-status"': 'class="fa fa-warning alarm"',
        card_status =  locations[i].working_parameters.dc_module_output_voltage > 20 ? 'class="card card-online"': 'class="card card-offline"',
        bordered_color =   authorizedBorderedColor[locations[i].network_operator],
        card = `<div ${card_status}>
        <header class="card-header ${bordered_color}">
          <p class="card-header-title is-uppercase">
            <a href="/us/sites/${locations[i].name}">${locations[i].name}</a>
          </p>
          <span class="card-header-icon" aria-label="more options">
              <span ${voltage}></span>
          </span>
        </header>
        <div class="card-content">                
            <ul class="list-unstyled">
              <li>
                <span class=" param-head is-uppercase">Availability</span>
                <span class="float-right">${locations[i].availability}%</span>
              </li>
              <li>
                  <span class="param-head is-uppercase">Voice traffic</span>
                  <span class="float-right">${locations[i].working_parameters.voice_traffic} </span>
                </li>
                <li>
                    <span class="param-head is-uppercase">Bandwidth</span>
                    <span class="float-right">${locations[i].working_parameters.bandwidth} </span>
                  </li>
                  <li>
                      <span class="param-head is-uppercase">Terminations</span>
                      <span class="float-right">${locations[i].working_parameters.terminations}</span>
                    </li>
            </ul>                  
            
          </div>
        </div> `;

    if(i == 0 || i%4 == 0){             
        $('#map-card').append(`<div class="columns"></div>`);
    }
    $('#map-card .columns:last').append(`<div class="column is-3">${card}</div>`)
    }
    
  }

//   event for the select options for All, Online and Offline
  document.getElementById('select-status').addEventListener('change', function(){
    if(this.value === 'all'){            
        $('#map-card').empty();
        populateCard();
        
        // $('.card-offline').show();
        // $('.card-online').show();
    }else if(this.value === 'online'){           
        $('#map-card').empty();
        for(let i=0;i<online.length;i++){           
            let voltage =  online[i].working_parameters.dc_module_output_voltage > 20 ? 'class="site-status"': 'class="fa fa-warning alarm"',
            card_status =  online[i].working_parameters.dc_module_output_voltage > 20 ? 'class="card card-online"': 'class="card card-offline"',
            bordered_color =   authorizedBorderedColor[online[i].network_operator],
            card = `<div ${card_status}>
            <header class="card-header ${bordered_color}">
              <p class="card-header-title is-uppercase">
                <a href="/us/sites/${online[i].name}">${online[i].name}</a>
              </p>
              <span class="card-header-icon" aria-label="more options">
                  <span ${voltage}></span>
              </span>
            </header>
            <div class="card-content">                
                <ul class="list-unstyled">
                  <li>
                    <span class=" param-head is-uppercase">Availability</span>
                    <span class="float-right">${online[i].availability}%</span>
                  </li>
                  <li>
                      <span class="param-head is-uppercase">Voice traffic</span>
                      <span class="float-right">${online[i].working_parameters.voice_traffic} </span>
                    </li>
                    <li>
                        <span class="param-head is-uppercase">Bandwidth</span>
                        <span class="float-right">${online[i].working_parameters.bandwidth} </span>
                      </li>
                      <li>
                          <span class="param-head is-uppercase">Terminations</span>
                          <span class="float-right">${online[i].working_parameters.terminations}</span>
                        </li>
                </ul>                  
                
              </div>
            </div> `;
    
        if(i == 0 || i%4 == 0){             
            $('#map-card').append(`<div class="columns"></div>`);
        }
        $('#map-card .columns:last').append(`<div class="column is-3">${card}</div>`)
        }
        
        // $('.card-offline').hide();
        // $('.card-online').show();
    }else{            
        $('#map-card').empty();
        if( offline.length === 0){
            $('#map-card').append('<div class="centralize is-4 title">No site is offline</div>');
        }else{
            for(let i=0;i<offline.length;i++){           
                let voltage =  offline[i].working_parameters.dc_module_output_voltage > 20 ? 'class="site-status"': 'class="fa fa-warning alarm"',
                card_status =  offline[i].working_parameters.dc_module_output_voltage > 20 ? 'class="card card-online"': 'class="card card-offline"',
                bordered_color =   authorizedBorderedColor[offline[i].network_operator],
                card = `<div ${card_status}>
                <header class="card-header ${bordered_color}">
                  <p class="card-header-title is-uppercase">
                    <a href="/us/sites/${offline[i].name}">${offline[i].name}</a>
                  </p>
                  <span class="card-header-icon" aria-label="more options">
                      <span ${voltage}></span>
                  </span>
                </header>
                <div class="card-content">                
                    <ul class="list-unstyled">
                      <li>
                        <span class=" param-head is-uppercase">Availability</span>
                        <span class="float-right">${offline[i].availability}%</span>
                      </li>
                      <li>
                          <span class="param-head is-uppercase">Voice traffic</span>
                          <span class="float-right">${offline[i].working_parameters.voice_traffic} </span>
                        </li>
                        <li>
                            <span class="param-head is-uppercase">Bandwidth</span>
                            <span class="float-right">${offline[i].working_parameters.bandwidth} </span>
                          </li>
                          <li>
                              <span class="param-head is-uppercase">Terminations</span>
                              <span class="float-right">${offline[i].working_parameters.terminations}</span>
                            </li>
                    </ul>                  
                    
                  </div>
                </div> `;
        
            if(i == 0 || i%4 == 0){             
                $('#map-card').append(`<div class="columns"></div>`);
            }
            $('#map-card .columns:last').append(`<div class="column is-3">${card}</div>`)
            }
        }
        
        
        
    }
})

// for search textfield
document.getElementById('search-site').addEventListener('keyup', function(event){
    if(event.keyCode === 13){
        searched = [];
        locations.forEach((x)=>{
            if(x.name === this.value.toLowerCase()){
                searched.push(x)
            }
        });
        $('#map-card').empty();
        if(searched.length === 0){
            $('#map-card').append('<div class="is-4 title centralize">This site does not exist or not found</div>')
        }else{
        for(let i=0;i<searched.length;i++){           
            let voltage =  searched[i].working_parameters.dc_module_output_voltage > 20 ? 'class="site-status"': 'class="fa fa-warning alarm"',
            card_status =  searched[i].working_parameters.dc_module_output_voltage > 20 ? 'class="card card-online"': 'class="card card-offline"',
            bordered_color =   authorizedBorderedColor[searched[i].network_operator],
            card = `<div ${card_status}>
            <header class="card-header ${bordered_color}">
              <p class="card-header-title is-uppercase">
                <a href="/us/sites/${searched[i].name}">${searched[i].name}</a>
              </p>
              <span class="card-header-icon" aria-label="more options">
                  <span ${voltage}></span>
              </span>
            </header>
            <div class="card-content">                
                <ul class="list-unstyled">
                  <li>
                    <span class=" param-head is-uppercase">Availability</span>
                    <span class="float-right">${searched[i].availability}%</span>
                  </li>
                  <li>
                      <span class="param-head is-uppercase">Voice traffic</span>
                      <span class="float-right">${searched[i].working_parameters.voice_traffic} </span>
                    </li>
                    <li>
                        <span class="param-head is-uppercase">Bandwidth</span>
                        <span class="float-right">${searched[i].working_parameters.bandwidth} </span>
                      </li>
                      <li>
                          <span class="param-head is-uppercase">Terminations</span>
                          <span class="float-right">${searched[i].working_parameters.terminations}</span>
                        </li>
                </ul>                  
                
              </div>
            </div> `;
    
        if(i == 0 || i%4 == 0){             
            $('#map-card').append(`<div class="columns"></div>`);
        }
        $('#map-card .columns:last').append(`<div class="column is-3">${card}</div>`)
        }
    }


    }
    
});

// for reset button this will display all the site cards, and also clear the search textfield
document.getElementById('reset').addEventListener('click', function(){
    $('#map-card').empty();
    document.getElementById('search-site').value = '';
    populateCard();
});



