import axios from 'axios'

const estructura = [
    'fuente',
    'empresa',
    'totalUsuariosSinSuministro',
    'totalUsuariosConSuministro',
    'ultimaActualizacion',
    'totalUsuariosAyer',
    'cortesPreventivos',
    'cortesProgramados',
    'cortesServicioMedia',
    'cortesComunicados',
    'cortesServicioBaja',
]

const estructuraSubSubItems = [
    'partido',
    'localidad',
    'subestacion_alimentador',
    'usuarios',
    'normalizacion'
]

const estructuraSubSubItemsBaja = [
    'partido',
    'localidad',
    'usuarios',
]

let reg = {}

let subSubKey, subSubValue

export default async (req, resp) => {
    switch(req.method){
        case 'GET':{

            await axios.get('https://www.enre.gov.ar/paginacorte/js/data_EDS.js')
            .then(function (response) {
                let data = response.data.substring(12)

                //return(console.log(data))
        
                data = data.split(',\r\n')
                
                data.map((item, i) =>{
        
                    let key = ''
                    let value = ''
                    item = item.replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '').replace(/'/g, "").trim()
                    
                    if(i < 6){
        
                        item = item.split(': ')
                        key = item[0].trim()
                        value = item[1].trim()
                        if(key == estructura[i]){
                            reg = {
                                ...reg,
                                [key] : value
                            }
                        }else{
                            console.log(`error al obtener ${estructura[i]}`)
                        }
                    }
        
                    if(i >= 6 && i < 10){
                        item = item.split('[')
                        key = item[0].replace(/:/g, "").trim()
                        value = item[1].replace(/]/g, "").trim()
                        if(key == estructura[i]){
                            if(value == ''){
                                reg = {
                                    ...reg,
                                    [key] : []
                                }
                            }else{
                                value = value.split('},{')
                                let arr = []
                                value.map((subItem, subI) => {
                                    subItem = (subItem.replace(/{|}/g, ""))
                                    subItem = subItem.split(',')
                                    let obj = {}
                                    subItem.map((subSubItem, subSubI) => {
                                        subSubItem = subSubItem.split(': ')
                                        subSubKey = subSubItem[0].replace(/['"]+/g, '').replace(/'/g, "").trim()
                                        subSubValue = subSubItem[1].replace(/['"]+/g, '').replace(/'/g, "").trim()
                                        if(estructuraSubSubItems[subSubI] == subSubKey){
                                            obj = {
                                                ...obj,
                                                [subSubKey] : subSubValue
                                            }
                                        }else{
                                            console.log(`Error al obtener ${estructuraSubSubItems[subSubI]} de ${key}`)
                                        }
                                    })
                                    arr.push(obj)
                                })
                                reg = {
                                    ...reg,
                                    [key] : arr
                                }
                            }
                        }else{
                            console.log(`error al obtener ${estructura[i]}`)
                            console.log(key)
                        }
                    }
        
                    if(i == 10){
                        item = item.split('[')
                        key = item[0].replace(/:/g, "").trim()
                        value = item[1].replace(/]/g, "").trim()
                        if(key == estructura[i]){
                            if(value == ''){
                                reg = {
                                    ...reg,
                                    [key] : []
                                }
                            }else{
                                value = value.split('}, {')
                                let arr = []
                                value.map((subItem, subI) => {
                                    subItem = (subItem.replace(/{|}/g, ""))
                                    subItem = subItem.split(',')
                                    let obj = {}
                                    subItem.map((subSubItem, subSubI) => {
                                        subSubItem = subSubItem.split(':')
                                        subSubKey = subSubItem[0].replace(/['"]+/g, '').replace(/'/g, "").trim()
                                        subSubValue = subSubItem[1].replace(/['"]+/g, '').replace(/'/g, "").trim()
                                        if(estructuraSubSubItemsBaja[subSubI] == subSubKey){
                                            obj = {
                                                ...obj,
                                                [subSubKey] : subSubValue
                                            }
                                        }else{
                                            console.log(`Error al obtener ${estructuraSubSubItemsBaja[subSubI]} de ${key}`)
                                        }
                                    })
                                    arr.push(obj)
                                })
                                reg = {
                                    ...reg,
                                    [key] : arr
                                }
                            }
                        }else{
                            console.log(`error al obtener ${estructura[i]}`)
                            console.log(key)
                        }
                    }            
        
                })
                
                resp.json(reg)
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });            

        }         
    }
}