import React from 'react';
import CreditCardInformation from './CreditCards';
import cookie from 'js-cookie';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function submitRequest(path, requestBody, handleSignedIn, handleError) {
    fetch(path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    }).then(response => response.json())
      .then(json => {
            console.log("Response received...")
            if (json.error === undefined || !json.error) {
                //save cookie if not error
                console.log("Sign in Success...");
                cookie.set("user", json);
                handleSignedIn(json);
            } else {
                handleError(json.error);
            }
        })
        .catch(error=>console.log(error));
}

//다른 파일에서 이 클래스를 사용하기 때문에 export 키워드가 필요하다
export function BuyModalWindow(props) {
    return (
        <Modal id="buy" tabIndex="-1" role="dialog" isOpen={props.showModal} toggle={props.toggle}>
            <div role="document">
                    <ModalHeader toggle={props.toggle} className="bg-success text-white">
                        Buy Item
                    </ModalHeader>
                    <ModalBody>
                        <CreditCardInformation user={props.user} seperator={false} show={true} productid={props.productid} price={props.price} operation="Charge" toggle={props.toggle} />
                    </ModalBody>
                </div>
                      
        </Modal>
    );
}

class SignInForm extends React.Component{
	constructor(props){
		super(props);
		//사용자가 데이터를 입력하면 호출되는 함수
		this.handleChange=this.handleChange.bind(this);
		//폼을 제출하면 호출되는 함수
		this.handleSubmit=this.handleSubmit.bind(this);
		this.state={
			//로그인 실패 시 에러 메세지를 저장할 필드
			errormessage:''
		}
	}
	
	//로그인 폼을 출력하고 사용자의 입력을 받아 폼을 제출
	//로그인 실패 시 에러 메세지를 출력하고 다시 로그인할 수 있게 한다
	render(){
		//에러 메세지
		let message = null;
		//state에 에러 메세지가 있다면 출력
		if(this.state.errormessage.length !== 0){
			//!==는 변수 타입까지 고려한 비교 ex)숫자1과 문자1은 다름
			message=<h5 className="mb-4 text-danger">{this.state.errormessage}</h5>;
		}
		return (
			<div>
				{message}
				<form onSubmit={this.handleSubmit}>
					<h5 className="mb-4">Basic Info</h5>
					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input name="email" type="email" className="form-control" id="email" onChange={this.handleChange}/>
					</div>
					<div className="form-group">
						<label htmlFor="pass">Password:</label>
						<input name="password" type="password" className="form-control" id="pass" onChange={this.handleChange}/>
					</div>
					<div className="form-row text-center">
						<div className="col-12 mt-2">
							<button type="submit" className="btn btn-success btn-large">Sign in</button>
						</div>
						<div className="col-12 mt-2"> 
							<button type="submit" className="btn btn-link text-info" onClick={() => this.props.handleNewUser()}> New User? Register</button>
						</div>
					</div>
				</form>
			</div>
		)
	}

	handleChange(event){
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]:value
		});
		/*
			state = {
				'email' : 'user@email.com'
				'password' : 'user01'
			}
		*/
	}
	
	handleSubmit(event){
		//보통 Submit 태그나 a 태그를 누르면 페이지가 새로고침된다.
		//메서드 이름 그대로 기본 작업을 방지한다는 의미로 새로고침되지 않는다.
		//페이지가 새로고침 안될 뿐이지 submit은 작동한다
		//a 하이퍼링크는 작동 안함
		event.preventDefault();
        submitRequest('users/signin', this.state, this.props.handleSignedIn,this.handleError);
	}
}

class RegisterationForm extends React.Component{
	constructor(props){
		super(props);
		this.state={
			errormessage:''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		event.preventDefault();
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]:value
		});
	}

	handleSubmit(event){
		event.preventDefault();
        const userInfo = this.state;
		
		if(userInfo.username == null){
			alert("USERNAME IS EMPTY");
			return;
		}
        const firstlastname = userInfo.username.split(" ");
        if (userInfo.pass1 !== userInfo.pass2) {
            alert("PASSWORDS DO NOT MATCH");
            return;
        }
        const requestBody = {
            firstname: firstlastname[0],
            lastname: firstlastname[1],
            email: userInfo.email,
            password: userInfo.pass1
        };
        submitRequest('users', requestBody, this.props.handleSignedIn, this.handleError);
        this.props.showRegistrationForm = false
        console.log("Registration form: " + requestBody);
	}
	
	render(){
		let message = null;
		if(this.state.errormessage.length !== 0) {
			message=<h5 className="mb-4 text-danger">{this.state.errormessage}</h5>;
		}

		return (
			<div>
				{message}
				<form onSubmit={this.handleSubmit}>
					<h5 className="mb-4">Registeration</h5>
					<div className="form-group">
						<label htmlFor="username">User Name:</label>
						<input id='username' name='username' className='form-control' placeholder='John Doe' type='text' onChange={this.handleChange} />
					</div>
					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input id='email' name='email' className='form-control' type='email' onChange={this.handleChange} />
					</div>
					<div className="form-group">
						<label htmlFor="pass">Password:</label>
						<input id='pass1' name='pass1' className='form-control' type='password' onChange={this.handleChange} />
					</div>
					<div className="form-group">
						<label htmlFor="pass">Confirm Password:</label>
						<input id='pass2' name='pass2' className='form-control' type='password' onChange={this.handleChange} />
					</div>
					<div className="form-row text-center">
						<div className="col-12 mt-2">
							<button type="submit" className="btn btn-success btn-large">Register</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export class SignInModalWindow extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showRegistrationForm: false
		}
		this.handleNewUser = this.handleNewUser.bind(this);
		this.handleClosed = this.handleClosed.bind(this);
	}

	handleNewUser(){
		this.setState({
			showRegistrationForm:true
		});
	}

	handleClosed(){
		console.log("closed modelwindow")
		this.setState({
			showRegistrationForm:false
		});
	}
	
	render(){
		let modalBody = <SignInForm handleSignedIn={this.props.handleSignedIn} handleNewUser={this.handleNewUser} />
		if(this.state.showRegistrationForm === true){
			modalBody = <RegisterationForm handleSignedIn={this.props.handleSignedIn}/>;
		}

		return (
			<Modal id='register' tabIndex='-1' role='dialog' isOpen={this.props.showModal} toggle={this.props.toggle} onClosed={this.handleClosed}>
				<div role='document'>
					<ModalHeader toggle={this.props.toggle} className='bg-success text-white'>
						Sign-in
						{
							//  <button className="close">
							//  	<span aria-hidden='true'>&times;</span>
							//  </button>
						}
					</ModalHeader>
					<ModalBody>
						{modalBody}
					</ModalBody>
				</div>
			</Modal>
		);
	}
}