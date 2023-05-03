import React from "react";
// import { FiSearch } from "react-icons/fi"

const Search = () => {
    return (
        <header>
            <h2 className="header__title">Find it. Tour it. Own it.</h2>
            <div>
                <input
                    type="text"
                    className="header__search"
                    placeholder="Enter an address, neighborhood, city, or ZIP code"
                />
                {/* <FiSearch className="header__icon" />*/}

            </div>

        </header>
    );
}

export default Search;