import axios from "axios";


export async function getApiData(url) {
    const response = await axios.get(url);
    return response.data;
}

/**
 * 
 * @param {string} CID 
 */
export async function initIpfs(CID, first, last, isIPFS) {

    //Utilisation de l'HTTP client => le serveur doit faire tourner sa propre node IPFS

    //const node = await IPFS.create()

    //tableau de promises vide
    var metadata_array = [];
    var collection_size = last - first;
    var base_url;

    if (isIPFS === true) {
        base_url = 'http://127.0.0.1:8080/ipfs/' + CID + '/';
    }
    else {
        console.log("ELSE");
        base_url = CID;
    }
    console.log(base_url);

    //On stocke chaque promise dans le tableau sans attendre le retour de la précédente
    for (let i = first; i < last; i++) {
        console.log(isIPFS);
        console.log(base_url);
        let url = base_url + i.toString();
        //const stream = client.cat(fullpath);
        try {
            const result = await getApiData(url);
            if (i % 5 == 0)
                metadata_array.push(result);
        } catch (err) {
            console.log(err);
        }
    }

    let rarity_data = calc_collection_rarity(metadata_array, collection_size);
    calc_mint_rarity(metadata_array, rarity_data);
    metadata_array.sort((a, b) => a.rarity_score - b.rarity_score);
    console.log(metadata_array);
    return { rarity_data: rarity_data, metadata_array: metadata_array };

}

export function calc_mint_rarity(metadata_array, rarity_data) {
    metadata_array.forEach((object) => {
        let rarity_score = 1;
        object.attributes.forEach((attribute) => {
            let type = rarity_data.traits_types.find(o => o.name === attribute.trait_type);
            let value = type.values.find(o => o.name === attribute.value);
            console.log(value);
            //console.log(trait_type_info.values[index].name, "===", trait_value.toString())
            rarity_score *= +value.absoluteRate;


        })
        // console.log(object)
        // console.log(rarity_score)
        object["rarity_score"] = rarity_score;

    })
    //console.log(metadata_array)
}

/**
 * 
 * @param {*} metadata_array les données de l'ensemble des objets de la collection
 * 
 */
export function calc_collection_rarity(metadata_array, collection_size) {
    var propertyToTrait = {
        "traits_types": [
        ]
    };


    metadata_array.forEach((object) => {

        object.attributes.forEach((attribute) => {

            //Si le TYPE existe on INCREMENTE LE COMPTE
            let type = propertyToTrait.traits_types.find(o => o.name === attribute.trait_type);
            if (type !== undefined) {
                type.count++;
                //Si la VALEUR existe on INCREMENTE sinon on la CREE et INITIALISE
                let value = type.values.find(o => o.name === attribute.value);
                if (value !== undefined) {
                    value.count++;
                }
                else {
                    type.values.push({ "name": attribute.value, "count": 1 });
                }
                //Si le TYPE n'existe PAS alors la VALEUR NON PLUS
            } else {
                propertyToTrait.traits_types.push({ "name": attribute.trait_type, "values": [{ "name": attribute.value, "count": 1 }], "count": 1 });
            }

        });


    });


    propertyToTrait.traits_types.forEach((property) => {
        property['propertyRate'] = property['count'] / collection_size * 100;
        property['values'].forEach((value) => {
            value['relativeRate'] = ((value['count'] / property['count'])) * 100;
            value['absoluteRate'] = ((value['count'] / property['count']) * 100 * property['propertyRate'] / 100);
        })
    })


    return propertyToTrait;

}
/**
*
* @param {*} stream
* @returns json-object of queryied data
*/
// export async function getChunks(stream) {
//    let data = ''
//    for await (const chunk of stream) {
//        // chunks of data are returned as a Buffer, convert it back to a string
//        data = JSON.parse(new TextDecoder().decode(chunk))
//        //console.log(data)
//        return data;
//    }
// }