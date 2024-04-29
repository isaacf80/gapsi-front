import axios from 'axios';
import { Proovedor } from '../interfaces/proveedor.dto';

export class ProovedoresService {

    private BASE_URL = 'http://localhost:8080/api/proveedores';
    
    saveProvider( request: Proovedor) {
        return axios.post(this.BASE_URL + '/saveProvider', request);
    }

    list( ) {
        return axios.get(this.BASE_URL + '/list');
    }

    deleteProvider( request: Proovedor) {
        return axios.get(this.BASE_URL + '/deleteProvider/' + request.idProvider);
    }    
}