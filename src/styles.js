let styles = {
    background_colour: "rgba(0, 120, 138, 1);",
    text_colour: "rgb(248, 248, 248);",
    text_colour_neg: "rgb(50, 50, 50);",

    banner_background: `linear-gradient(to left, rgba(0, 120, 138, 0.9), rgba(0, 120, 138, 0.8))`,
    body : {
        "margin": 0,
        "height": "100%",
        "width": "100%",
        "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale"
    },
    html : {
        height: "100%"
    },
    header_height: "50px",
    // *************** SIDE MENU STYLES *****************
    side_menu_width: "300px",
    side_menu_background: "rgba(250, 250, 250, 1)",
    side_menu_text: "rgba(50, 50, 50, .8)",
    drop_down_header_background: "rgba(0, 120, 138, 0.9);",
    window_header_height: "40px",
    window_background_colour: "rgba(0,0,0,0.2)",
    ttBackground: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 88%, rgba(248,248,248,1) 100%)",
    convertToInt(styleString) {
        return parseInt(styleString.split("p")[0]);
    }
};

module.exports = styles;