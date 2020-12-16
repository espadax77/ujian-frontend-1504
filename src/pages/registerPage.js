import React from 'react'
import Axios from 'axios'
import {
    Button,
    InputGroup,
    Form,
    FormControl,
    Modal
} from 'react-bootstrap'

const URL = 'http://localhost:3000/users'

class RegisterPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible1: false,
            visible2: false,
            userValidErr: [false, ""],
            emailValidErr: [false, ""],
            passValidErr: [false, ""],
            regError: [false, ""]
        }
    }

    handleRegister = () => {
        const { userValidErr, emailValidErr, passValidErr } = this.state
        let username = this.refs.username.value
        let email = this.refs.email.value
        let password = this.refs.password.value
        let confpass = this.refs.confpassword.value

        if (!username || !email || !password || !confpass) return this.setState({ regError: [true, "Please input data"] })

        if (confpass !== password) return this.setState({ regError: [true, "Password does not match with Confirm Password"] })

        if (userValidErr[0] || emailValidErr[0] || passValidErr[0]) return this.setState({ regError: [true, "Check again to confirm error"] })

        Axios.get(`${URL}?username=${username}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this username is already used"] })

                Axios.get(`${URL}?email=${email}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this email is already used"] })

                        Axios.post('http://localhost:3000/users', {
                            username: username,
                            password: password,
                            role: "user",
                            email: email,
                            cart: []
                        })
                            .then((res) => {
                                console.log(res.data)
                                console.log('Register success')
                                this.setState({ regError: [false, ""] })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    userValid = (e) => {
        let username = e.target.value
        let symb = /[!@#$%^&*;]/

        if (symb.test(username) || username.length < 6) return this.setState({ userValidErr: [true, "*min 6 char and no symbols allowed"] })

        this.setState({ userValidErr: [false, ""] })
    }

    emailValid = (e) => {
        let email = e.target.value
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) return this.setState({ emailValidErr: [true, "*Email not valid"] })

        this.setState({ emailValidErr: [false, ""] })
    }

    passValid = (e) => {
        let pass = e.target.value
        let symb = /[!@#$%^&*:]/
        let numb = /[0-9]/

        if (!symb.test(pass) || !numb.test(pass) || pass.length < 6) return this.setState({ passValidErr: [true, "*Must include symbol, number, min 6 char"] })

        this.setState({ passValidErr: [false, ""] })
    }

    render() {
        const { visible1, visible2, userValidErr, emailValidErr, passValidErr, regError } = this.state
        return (
            <div style={styles.container}>
                <div style={styles.center}>
                    <div>
                        <h1>Register</h1>
                    </div>
                    <div style={{ ...styles.item, textAlign: 'center' }}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-user-circle"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                ref="username"
                                onChange={(e) => this.userValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {userValidErr[1]}
                        </Form.Text>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-envelope" />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                ref="email"
                                onChange={(e) => this.emailValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {emailValidErr[1]}
                        </Form.Text>
                        <InputGroup>
                            <InputGroup.Prepend style={{ cursor: 'pointer' }}
                                onClick={() => this.setState({ visible1: !visible1 })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible1 ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                type={visible1 ? "text" : "password"}
                                ref="password"
                                onChange={(e) => this.passValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {passValidErr[1]}
                        </Form.Text>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{ cursor: 'pointer' }}
                                onClick={() => this.setState({ visible2: !visible2 })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible2 ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Confirm Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                type={visible2 ? "text" : "password"}
                                ref="confpassword"
                            />
                        </InputGroup>
                        <Button onClick={this.handleRegister}>
                            Register <i className="fas fa-user-plus" style={{ marginLeft: '10px' }}></i>
                        </Button>
                    </div>
                    <Modal show={regError[0]} onHide={() => this.setState({ regError: [false, ""] })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{regError[1]}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ regError: [false, ""] })}>
                                Okay
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        height: "100vh",
    },
    center: {
        marginTop: 100,
        padding: "10px 30px",
        width: 350,
        height: "68vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "30px",
    },
    item: {
        width: "100%",
        height: "auto",
        marginBottom: 15,
    }
}

export default RegisterPage
