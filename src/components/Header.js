import "../css/Header.css";
import "../css/margin.css";
import "../css/padding.css";
import { useNavigate } from "react-router-dom";
import { useBreakpointValue, Box } from "@chakra-ui/react";

const Header = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();    
    return (
        <div className="Flex Header px-1 py-2">
            <h2>BioScope</h2>
            <Box display="flex" flexDirection={isMobile?"column":"row"} gap={isMobile?"5px":"20px"}>
                <div onClick={() => navigate("/")}>Theatres</div>
                <div onClick={() => navigate("/movies")}>Movies</div>                
                {/* <a>LogOut</a>               */}
                {/* <button>Logout</button> */}
            </Box>
        </div>
    )
}

export default Header;