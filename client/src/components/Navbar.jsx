import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi';
import './Navbar.scss';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <nav className="ud-navbar">
            <div className="nav-left">
                <div className="logo" onClick={() => navigate('/')}>E-LEARN</div>
                <button className="categories-btn">Categories</button>
            </div>

            <div className="nav-center">
                <div className="search-bar">
                    <HiOutlineSearch className="search-icon" />
                    <input type="text" placeholder="Search for anything" />
                </div>
            </div>

            <div className="nav-right">
                {user?.role === 'instructor' ? (
                    <Link to="/instructor/dashboard" className="nav-link hide-mobile font-bold">Instructor</Link>
                ) : (
                    <Link to="/" className="nav-link hide-mobile">Teach on E-Learn</Link>
                )}
                <div className="nav-icons">
                    <button className="icon-btn"><HiOutlineShoppingCart /></button>
                    {token ? (
                        <>
                            <button className="icon-btn"><HiOutlineBell /></button>
                            <div className="user-dropdown" onClick={() => navigate('/profile')}>
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="profile" className="profile-thumb" />
                                ) : (
                                    <HiOutlineUserCircle size={32} />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-btns">
                            <button className="btn-login" onClick={() => navigate('/login')}>Log In</button>
                            <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
