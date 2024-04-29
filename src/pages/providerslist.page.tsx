import { Dialog } from 'primereact/dialog';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProovedoresService } from '../services/proovedores.service';
import { Proovedor } from '../interfaces/proveedor.dto';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';

const ProvederListPage = (): JSX.Element => {
	const proovedoresService = new ProovedoresService();

	const [visible, setVisible] = useState(false);

	const [idProvider, setIdProvider] = useState(0);
    const [stock, setStock] = useState({ name: 'En stock', code: 0 });
	const [name, setName] = useState('');
	const [contact, setContact] = useState('');
	const [active, setActive] = useState({ name: 'Si', code: 1 });
	const [amount, setAmount] = useState(0);
	const [desc, setDesc] = useState('');
	const [proovedores, setProovedores] = useState([] as Proovedor[]);

    const statusOptions = [
        { name: 'Si', code: 1 },
        { name: 'No', code: 0 },
    ];

    const stockOptions = [
        { name: 'En stock', code: 0 },
        { name: 'Bajo stock', code: 1 },
        { name: 'Sin stock', code: 2 }
    ];

	useEffect(() => {
		proovedoresService.list().then(function (response) {
			const data = response.data as Proovedor[];
	
			setProovedores(data);
	
		})
		.catch(function (error) {
			console.log(error);
		});
	}, []);

	const onSaveItem = () => {
		const proovedor = {} as Proovedor;

		proovedor.idProvider = idProvider;
		proovedor.stock = stock.code;
		proovedor.name = name;
		proovedor.contact = contact;
		proovedor.amount = amount;
		proovedor.description = desc;
		proovedor.active = active.code;

		proovedoresService.saveProvider(proovedor).then(function (response) {

			if (idProvider > 0){
				//Update
				const item = proovedores.find(o => o.idProvider === proovedor.idProvider);

				if (item){
					item.stock = proovedor.stock;
					item.name = proovedor.name;
					item.contact = proovedor.contact;
					item.amount = proovedor.amount;
					item.description = proovedor.description;
					item.active = proovedor.active;
	
					toast.current?.show({ severity: 'success', detail: 'Información guardada correctamente', life: 3000 });
	
					setVisible(false);
				}
			}else{
				//new
				proovedores.unshift(response.data);

				setProovedores([...proovedores]);

				setVisible(false);
			}
			
		})
		.catch(function (error) {
			console.log(error);
		});
	}

    const statusBodyTemplate = (proovedor: Proovedor) => {
        return <Tag value={stockOptions[proovedor.stock].name} severity={getSeverity(proovedor)}></Tag>;
    };

    const activeBodyTemplate = (proovedor: Proovedor) => {
        return statusOptions[proovedor.active].name;
    };

    const amountBodyTemplate = (proovedor: Proovedor) => {
        return formatCurrency(proovedor.amount);
    };

    const actionBodyTemplate = (proovedor: Proovedor) => {
        return <>
			<Button icon="pi pi-search" rounded severity="success" onClick={() => editProovedor(proovedor)}/>
			<Button icon="pi pi-times" rounded severity="danger" onClick={() => confirmDelete(proovedor)}/>
		</>;
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const getSeverity = (proovedor: Proovedor) => {
        switch (proovedor.stock) {
            case 0:
                return 'success';

            case 1:
                return 'warning';

            case 2:
                return 'danger';

            default:
                return null;
        }
    };

	const toast = useRef<Toast>(null);

    const acceptFunc = (proovedor: Proovedor) => {
		proovedoresService.deleteProvider(proovedor).then(function (response) {
			let i = proovedores.indexOf(proovedor);

			if (i > -1){
			  proovedores.splice(i, 1);

			  setProovedores([...proovedores]);

			  toast.current?.show({ severity: 'success', detail: 'Registro eliminado', life: 3000 });
			}
		})
		.catch(function (error) {
			console.log(error);
		});
    }

    const reject = () => {
    }

    const confirmDelete = (proovedor: Proovedor) => {
        confirmDialog({
            message: '¿Seguro/a que deseas borrar este proveedor?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => acceptFunc(proovedor),
            reject
        });
    };

	const newProovedor = () => {
		setIdProvider(0);
		setStock(stockOptions[0]);
		setName('');
		setContact('');
		setActive(statusOptions[0]);
		setAmount(0);
		setDesc('');

		setVisible(true);
	}

	const editProovedor = (proovedor: Proovedor) => {
		setIdProvider(proovedor.idProvider);
		setStock(stockOptions[proovedor.stock]);
		setName(proovedor.name);
		setContact(proovedor.contact);
		setActive(statusOptions[proovedor.active]);
		setAmount(proovedor.amount);
		setDesc(proovedor.description);

		setVisible(true);
	}

    const endContent = (
        <React.Fragment>
			<Button icon="pi pi-plus" className="mr-2" onClick={() => newProovedor()}/>
        </React.Fragment>
    );

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <h3 className="text-xl text-900 font-bold">Lista de proveedores</h3>
        </div>
    );
    const footer = `Total, de proveedores: ${proovedores ? proovedores.length : 0}`;

	return (
		<>
			<br></br>
			<br></br>
			<br></br>
			<br></br>

            <Toast ref={toast} />
            <ConfirmDialog />

			<Toolbar end={endContent} />

			<DataTable value={proovedores} paginator rows={5} rowsPerPageOptions={[5, 10]} tableStyle={{ minWidth: '60rem' }} header={header} footer={footer}>
				<Column header="Stock" body={statusBodyTemplate}></Column>
				<Column header="Nombre" field="name"></Column>
				<Column header="Activo" body={activeBodyTemplate}></Column>
				<Column header="Contacto" field="contact"></Column>
				<Column header="Descripcion" field="description"></Column>
				<Column header="Monto" body={amountBodyTemplate}></Column>
				<Column header="Acciones" body={actionBodyTemplate}></Column>
			</DataTable>

			<Dialog header="Datos de proveedor" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} className="addItem">
				<label htmlFor="fname">Stock:</label>
				<br />
				<Dropdown value={stock} onChange={(e) => setStock(e.value)} options={stockOptions} optionLabel="name" className="fieldData" />
				<br />
				<label htmlFor="fname">Nombre:</label>
				<br />
				<InputText value={name} onChange={(e) => setName(e.target.value)} className="fieldData"/>
				<br />
				<label htmlFor="lname">Contacto:</label>
				<br />
				<InputText value={contact} onChange={(e) => setContact(e.target.value)} className="fieldData"/>
				<br />
				<label htmlFor="fname">Inventario:</label>
				<br />
				<Dropdown value={active} onChange={(e) => setActive(e.value)} options={statusOptions} optionLabel="name" className="fieldData"/>
				<br />
				<label htmlFor="lname">Monto:</label>
				<br />
				<InputNumber value={amount} onValueChange={(e: InputNumberValueChangeEvent) => setAmount(e.value!)} showButtons mode="currency" currency="USD" className="fieldData"/>
				<br />
				<label htmlFor="lname">Descripción:</label>
				<br />
				<InputTextarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} cols={30} className="fieldData"/>
				<br />
				<br />
				
				<Button label="Guardar datos" icon="pi pi-check" onClick={(e) => onSaveItem()} className="buttonData"/>

			</Dialog>

		</>
	);

}

export default ProvederListPage;

