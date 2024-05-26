import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className='sidebar__logo'>
          <img src="" alt="" />
          </div>
          <div className="sidebar__action action">
            <Link className="action__item" to="/Home">
              <img src="./icons/material-symbols_home.svg" alt="" />Home
            </Link>

            <Link className="action__item" to="/Sozdly">
              <img src="./icons/material-symbols_match-word-rounded.svg" alt="" />Sozdly
            </Link>

            <Link className="action__item" to="/Tanda">
              <img src="./icons/bi_unity.svg" alt="" />Tanda
            </Link>

            <Link className="action__item" to="/MaqalDrop">
              <img src="./icons/teenyicons_drag-outline.svg" alt="" />Maqal Drop
            </Link>

            <Link className="action__item" to="/SuraqJauap">
              <img src="./icons/ic_round-quiz.svg" alt="" />Suraq - Jauap
            </Link>

            <Link className="action__item" to="/Sozjumbaq">
              <img src="./icons/material-symbols_crossword.svg" alt="" />Soz Jumbaq
            </Link>
          
          </div>

          <div className='sidebar__line'></div>
            
          <Link className="sidebar__button" to="/Adamzat">
              <img src="./icons/mingcute_game-2-fill.svg" alt="" />Adamzat
          </Link>
         
        </div>
      </div>
  );
};


export default Sidebar;
