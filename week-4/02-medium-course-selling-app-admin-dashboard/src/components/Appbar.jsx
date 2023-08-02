import React from "react";
import { Button,Typography,AppBar,Toolbar,Menu,MenuItem,IconButton } from "@mui/material";
import { Box,Stack } from '@mui/system';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

function Appbar(){
    const [username,setUsername] = React.useState(null);
    const [anchorElProfile,setAnchorElProfile] = React.useState(null);
    const [anchorElMenu,setAnchorElMenu] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token){
            axios({
                url:"http://localhost:3000/authenticate",
                method: "GET",
                headers: {
                    authorization: "Bearer " + token
                },
                responseType: "json"
            })
            .then(res => {
                setUsername(res.data.user.username);
            })
            .catch(err => {
                console.log(username);
                console.log(err);
            });
        }
        else{
            console.log(username);
        }
    }, []);

    return (
        <AppBar position={"static"} sx={{borderRadius:3,backgroundColor:"#1976d2",display:"flex",justifyContent:"center",flexDirection:"column",height:"10%"}}>
            <Toolbar disableGutters >
                <Box display={'flex'} flexGrow={1}>
                    {Boolean(username) && (
                            <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            sx={{margin:1}}
                            >
                                <MenuIcon />
                            </IconButton>
                    )}
                    <Typography variant={'h4'}
                                noWrap
                                component={'a'}
                                href={"/"}
                                sx = {{
                                    marginLeft:2,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color: 'white',
                                    textDecoration: 'none'
                                }}>
                        SkillRamp
                    </Typography>
                </Box>
                    
                {Boolean(username) && (
                    <div>
                        <IconButton
                            size="large"
                            edge="end"
                            onClick={(event) => {
                                console.log(event.currentTarget,event);
                                setAnchorElProfile(event.currentTarget);
                            }}
                            color="inherit"
                            sx={{margin:1}}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElProfile}
                            open={Boolean(anchorElProfile)}
                            keepMounted
                            onClose={() => setAnchorElProfile(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                            }}
                        >
                            <MenuItem>{username}</MenuItem>
                            <MenuItem onClick={() => {
                                setUsername(null);
                                sessionStorage.clear();
                                navigate("/login");
                            }}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );

    // if (username){
    //     return (

    //         <div id={"app-bar"}>
    //             <div id={"app-bar-child-1"}>
    //                 <Link to={"/"}><h1>SkillRamp</h1></Link>
    //             </div>
    //             <div id={"app-bar-child-2"}>
    //                 <Box sx={{width:"20%",height:"80%"}}>
    //                     <Typography color={'white'} variant={"subtitle-1"}>
    //                         Logged in: {username}
    //                     </Typography>
    //                 </Box>
    //                 <ThemeProvider theme={theme}>
    //                     <div className={"grandchild-element"}>
    //                         <Button variant={"contained"} color={'secondary'}>Logout</Button>
    //                     </div>
    //                 </ThemeProvider>
    //             </div>
    //         </div>
    //         );
    // }
    // else{
    //     return (
    //         <div id={"app-bar"}>
    //             <div id={"app-bar-child-1"}>
    //             <Link to={"/"}><h1>SkillRamp</h1></Link>
    //             </div>
    //             <ThemeProvider theme={theme}>
    //                 <div id={"app-bar-child-2"}>
    //                     <div className={"grandchild-element"}>
    //                         <Button variant={"contained"} color={'primary'} onClick={() => {
    //                             navigate("/register");
    //                         }}>Sign-up</Button>
    //                     </div>
    //                     <div className={"grandchild-element"}>
    //                         <Button variant={"contained"} color={'primary'} onClick={() => {
    //                             navigate("/login");
    //                         }}>Sign-in</Button>
    //                     </div>
    //                 </div>
    //             </ThemeProvider>
    //         </div>
    //         );
    // }
    
}

export default Appbar;
