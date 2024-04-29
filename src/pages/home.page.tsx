import { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = (): JSX.Element => {

	const [nombre, setNombre] = useState('');

	const onChangeName = (value: string) => {
		setNombre(value);
	}

	return (
		<div className="row">
			<div className="welcome col-12 col-md-8 col-lg-6 col-xl-5">
			<div className="card welcomeCard text-white" style={{ borderRadius: "1rem" }}>
				<div className="card-body p-5 text-center">
				<div className="mb-md-5 mt-md-4 pb-5">
					<h2 className="mb-2">Escriba su nombre</h2>
					<input
						type="email"
						id="name"
						className="form-control form-control-lg"
						onChange={e => onChangeName(e.target.value)}
					/>
					<br></br>
					<h3 className="text-uppercase mb-2">Bienvenido</h3>
					<h2 className='welcomeName'>{nombre}</h2>
					<p className="small mb-5 pb-lg-2">
					</p>
					<Link className="btn btn-outline-light btn-lg px-5" to="/providerlist">Entrar</Link>
				</div>
				</div>
			</div>
			</div>
		</div>
	);
}

export default HomePage;