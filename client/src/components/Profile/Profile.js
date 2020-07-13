import React, { Component } from 'react'
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ImageUploading from "react-images-uploading";
import './Profile.css';
import { assign_user_personality, getUser, update_profile_data } from '../Services'
import Radar from 'react-d3-radar';

export class Profile extends Component {

    constructor(){
        super()
        this.state ={
            per_desc: '',
            edit: false,
            username: '',
            email: '',
            profile_pic: '',
            cluster: -1,
            CON: 0,
            NEU: 0,
            EXT: 0,
            AGR: 0,
            OPN: 0,
            uploaded: false
        }
    }

    onChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = () =>{
        assign_user_personality(this.state.per_desc).then(res =>{
            alert('Personality assigned')
        }).catch(err =>{
            console.log(err)
        })
    }

    onSubmitProfile = () => {
        const data = {
            username: this.state.username,
            email: this.state.email,
            profile_pic: this.state.profile_pic
        }

        update_profile_data(data).then(res =>{
            this.setState({edit: false})
            localStorage.setItem('username', this.state.username)
            localStorage.setItem('profile_pic', this.state.profile_pic)
            window.location.reload()
        })
    }

    edit = () => {
        this.setState({edit: true})
    }

    upload = (imageList) => {
        this.setState({uploaded: true})
        if(imageList.length > 0)
            this.setState({profile_pic: imageList[0]['dataURL']})
    }

    componentDidMount(){
        getUser().then(res =>{
            const user = JSON.parse(res.data.user)
            this.setState({per_desc: user['description']})
            this.setState({username: user['username']})
            this.setState({email: user['email']})
            this.setState({profile_pic: user['profile_pic']})
            this.setState({cluster: user['cluster']})
            this.setState({CON: user['personality_index']['CON']})
            this.setState({NEU: user['personality_index']['NEU']})
            this.setState({EXT: user['personality_index']['EXT']})
            this.setState({AGR: user['personality_index']['AGR']})
            this.setState({OPN: user['personality_index']['OPN']})
        })
    }

    render() {
        return (
        <div>
            <Navbar />
                
            <div className="container-fluid">
                    <div id="user_header" className="row">
                            {
                                this.state.edit && 
                                <div className="col">
                                    <ImageUploading 
                                    onChange={this.upload} 
                                    maxNumber={1}
                                    maxFileSize={5 * 1024 * 1024}
                                    acceptType={["jpg", "gif", "png", "PNG"]}
                                    >
                                        {({ imageList, onImageUpload, onImageRemoveAll }) => (
                                        
                                        <div className="upload__image-wrapper" >
                                            
                                            {imageList.map(image => (
                                            <div key={image.key} className="image-item" style={{paddingBottom:'10px'}}>
                                                {
                                                    this.state.uploaded &&
                                                    <img src={image.dataURL} onClick={onImageUpload} alt="img" width="80" height="80"  className="rounded img" style={{border: '2px solid white'}}/>
                                                }
                                            </div>
                                            ))}
                                            {
                                                !this.state.uploaded && 
                                                <div className="image-item" style={{paddingBottom:'10px'}}>
                                                    <img src={this.state.profile_pic} onClick={onImageUpload} alt="img" width="80" height="80"  className="rounded img" style={{border: '2px solid white'}}/>
                                                </div>
                                            }
                                            <div className="btn-group">
                                                <button className="btn" onClick={onImageUpload}>Upload Image</button>
                                                <button className="btn" onClick={onImageRemoveAll}>Remove Image</button>
                                            </div>
                                        </div>
                                        )}
                                    </ImageUploading>
                                </div>
                            }
                            {
                                !this.state.edit && <div className="col">
                                    <img alt="" src = {this.state.profile_pic} id="profile_pic" className="rounded img"/>
                                </div>
                            }

                        <div className={
                            (() => {
                                switch (this.state.edit) {
                                  case true:  return "col";
                                  case false: return "col-5";
                                }
                              })()
                        } style={{marginRight:'50px'}}>
                            <div className="row">
                                {
                                    !this.state.edit && 
                                    <h4 className="font-weight-light">{this.state.username}</h4>
                                }
                                {
                                    this.state.edit && 
                                    <React.Fragment>
                                    <div className="input-group mb-3">
                                        <input 
                                        value={this.state.username}
                                        onChange={this.onChange}
                                        type="text" className="form-control" placeholder="username" name="username" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">username</span>
                                        </div>
                                    </div>
                                    <div className="input-group mb-3">
                                        <input 
                                        value={this.state.email}
                                        onChange={this.onChange}
                                        type="text" className="form-control" placeholder="email" name="email" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">email</span>
                                        </div>
                                    </div>
                                    <button className="btn" onClick={this.onSubmitProfile}>Submit Changes</button>
                                    </React.Fragment>
                                }
                            </div>
                            
                            <div className="row">
                                {
                                    !this.state.edit && 
                                    <button onClick={this.edit} className="btn btn-outline-secondary">Edit Profile</button>
                                }
                            </div>
                        </div>

                        <div className="col-md-5">
                            <h6 className="font-weight-light"><i><b>{this.state.per_desc}</b></i></h6>
                        </div>
                    </div>
                    
                    <div id="heading" className="row">
                        <h4 className="font-weight-light">My Personality</h4>
                    </div>
                    
                    <div id="personality" className="row" style={{borderLeft:'1.5px solid #151B2D', borderRight:'1.5px solid #151B2D', paddingTop:'15px'}}>
                        <div className="col">
                        <Radar
                            width={500}
                            height={500}
                            padding={70}
                            domainMax={5}
                            highlighted={null}
                            onHover={(point) => {
                                if (point) {
                                console.log('hovered over a data point');
                                } else {
                                console.log('not over anything');
                                }
                            }}
                            data={{
                                variables: [
                                {key: 'Conscientiousness', label: 'Conscientiousness'},
                                {key: 'Neuroticism', label: 'Neuroticism'},
                                {key: 'Extraversion', label: 'Extraversion'},
                                {key: 'Agreeableness', label: 'Agreeableness'},
                                {key: 'Openness', label: 'Openness'},
                                ],
                                sets: [
                                {
                                    key: 'me',
                                    label: 'My Scores',
                                    values: {
                                        Conscientiousness: this.state.CON,
                                        Neuroticism: this.state.NEU,
                                        Extraversion: this.state.EXT,
                                        Agreeableness: this.state.AGR,
                                        Openness: this.state.OPN,
                                    },
                                }
                                ],
                            }}
                        />
                        </div>
                        <div className="col">
                        {
                            this.state.edit && 
                        <form onSubmit={this.onSubmit}>
                            <div className="row justify-content-center">
                                <div className="form-group" style={{ paddingTop:'15px'}}>
                                    <textarea 
                                    className="form-control" 
                                    name="per_desc"
                                    value={this.state.per_desc}
                                    onChange={this.onChange}
                                    id="exampleFormControlTextarea1" 
                                    rows="3" 
                                    style={{width:'500px', height:'180px'}} />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <button type="submit" className="btn btn-lg btn-outline-secondary">
                                    {
                                        this.state.cluster['cluster'] === -1 && 'Personalize Me'
                                    }
                                    {
                                        this.state.cluster['cluster'] !== -1 && 'Change Personality'
                                    }
                                </button>
                            </div>
                        </form>
                        }

                        </div>
                    </div>
                </div>
            
            <div style={{paddingBottom:'70px'}} />
            <Footer />
        </div>
        )
    }
}

export default Profile