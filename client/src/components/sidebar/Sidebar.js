import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__inner">
        <div className='sidebar__logo'>
          <img src="" alt="" />
        </div>
        <div className="sidebar__action action">
          {isAdmin ? (
            <>
              <Link className="action__item" to="/admin">
                <img src="" alt="" />Admin Page
              </Link>
              <Link className="action__item" to="/adminMaqalDrop">
                <img src="./icons/teenyicons_drag-outline.svg" alt="" />Maqal Drop
              </Link>
              <Link className="action__item" to="/adminSuraqJauap">
                <img src="./icons/ic_round-quiz.svg" alt="" />Suraq - Jauap
              </Link>
                <Link className="action__item" to="/admin/talda">
                    <img src="./icons/teenyicons_drag-outline.svg" alt="" />Talda
                </Link>
            </>
          ) : (
            <>
              <Link className="action__item" to="/home">
                <img src="./icons/material-symbols_home.svg" alt="" />Home
              </Link>
              <Link className="action__item" to="/sozdly">
                <img src="./icons/material-symbols_match-word-rounded.svg" alt="" />Sozdly
              </Link>
              <Link className="action__item" to="/tanda">
                <img src="./icons/bi_unity.svg" alt="" />Tanda
              </Link>
              <Link className="action__item" to="/maqalDrop">
                <img src="./icons/teenyicons_drag-outline.svg" alt="" />Maqal Drop
              </Link>
              <Link className="action__item" to="/suraqJauap">
                <img src="./icons/ic_round-quiz.svg" alt="" />Suraq - Jauap
              </Link>
                <Link className="action__item" to="/talda">
                    <img src="./icons/teenyicons_drag-outline.svg" alt="" />Talda
                </Link>
            </>
          )}
        </div>

        <div className='sidebar__line'></div>
          
        <Link className="sidebar__button" to="/adamzat">
            <img src="./icons/mingcute_game-2-fill.svg" alt="" />Adamzat
        </Link>
       
      </div>
    </div>
  );
};

export default Sidebar;
