import React from "react"
import { ethers } from 'ethers';
import firebase from '../Firestore'
import Loader from 'react-loader-spinner';
const abi = require('../abi');

//import Loader from 'react-loader-spinner'

class AddSponsor extends React.Component {
    constructor() {
        super()
        this.state = {
            Id: "",
            Address: "",
            Address1: "",
            Id1: "",
            loading1: false,
            loading2: false,
            Error1: "",
            Error2: "",
            Message: ""
        }
        this.handlechange = this.handlechange.bind(this)
        this.handlesubmit = this.handlesubmit.bind(this)
        this.handlesubmit1 = this.handlesubmit1.bind(this)
    }
    handlechange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handlesubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading1: true
        })
        let eth = window.ethereum;
        let add = await eth.enable()
        let provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        const signer = provider.getSigner();
        console.log(add.toString());
        let address = '0x7aca5a76324dbe1dfb0276b6960b5f79f21cc193'
        let contract = new ethers.Contract(address, abi, signer);
        try {
            await contract.addSponsorbyId(this.state.Id, this.state.Address);
            const db = firebase.firestore();
            db.collection("Sponsors").add({
                EventId: this.state.Id,
                Address: this.state.Address
            })
            this.setState({
                Address: "",
                Id: "",
                loading1: false,
                Error1: "",
                Error2: "",
                Message: "Request has been Accepted."
            })
        } catch (error) {
            console.log(error.message);
            this.setState({
                Error1: "It's already added or limit for sponsors is reached.",
                Message: ""
            })
        }
    }
    handlesubmit1 = async (e) => {
        e.preventDefault();
        this.setState({
            loading2: true
        })
        let eth = window.ethereum;
        let add = await eth.enable()
        let provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        const signer = provider.getSigner();
        console.log(add.toString());
        let address = '0x7aca5a76324dbe1dfb0276b6960b5f79f21cc193'
        let contract = new ethers.Contract(address, abi, signer);
        try {
            await contract.removeSponsorbyId(this.state.Id1, this.state.Address1);

            this.setState({
                Address1: "",
                Id1: "",
                loading2: false,
                Error1: "",
                Error2: "",
                Message: "Request has been Accepted."
            })
        } catch (error) {
            console.log(error.message);
            this.setState({
                Error2: "It's already Removed.",
                Message: ""
            })
        }
    }
    render() {
        const loading1 = this.state.loading1
        const loading2 = this.state.loading2
        return (
            <div>
                <h5>Add Sponsor</h5>
                <form onSubmit={this.handlesubmit}>
                    <input type="text" name="Id" label="Id" onChange={this.handlechange} value={this.state.Id} placeholder="Enter Id" />
                    <br />
                    <input type="text" name="Address" label="Address" onChange={this.handlechange} value={this.state.Address} placeholder="Enter Address to add" />

                    <button type="submit" disabled={loading1}>
                        {this.state.loading1 === true ? <Loader
                            type="Puff"
                            color="white"
                            height="30"
                            width="30"
                        /> : ""}Submit</button>


                </form>


                <h5>Remove Sponsor</h5>
                <form onSubmit={this.handlesubmit1}>
                    <input type="text" name="Id1" label="Id" onChange={this.handlechange} value={this.state.Id1} placeholder="Enter ID" />
                    <br />
                    <input type="text" name="Address1" label="Address" onChange={this.handlechange} value={this.state.Address1} placeholder="Enter Address to remove" />

                    <button type="submit" disabled={loading2} >
                        {this.state.loading2 === true ? <Loader
                            type="Puff"
                            color="white"
                            height="30"
                            width="30"
                        /> : ""}Submit</button>


                </form>
                {this.state.Message !== "" ? <p>{this.state.Message}</p> : ""}
                {this.state.Error1 !== "" ? <p>{this.state.Error1}</p> : ""}
                {this.state.Error2 !== "" ? <p>{this.state.Error2}</p> : ""}
            </div>
        )
    }
}
export default AddSponsor