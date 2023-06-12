import { Box, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { Location } from "@emotion-icons/entypo";
import { ArrowRightCircle, StarFill } from "@emotion-icons/bootstrap";
import {useNavigate} from "react-router-dom";

const TheatreCard = () => {    
    // const [selectedTheatre, setSelectedTheatre] = useState({}); 
    const apiData =  JSON.parse(localStorage.getItem("apiData"));
    const cardData = apiData.theatre;    
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();
    const dateinString = [];

    const handleClick = (theatre) => {        
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        // setSelectedTheatre(theatre)
        localStorage.setItem("selectedTheatre",JSON.stringify(theatre)); 
        navigate("/showDetails")

        if(theatre.booked_seats !== undefined) {
            theatre.booked_seats.map((item, index) => {                
            const dateArray = item.date.split("/")
            const dateStr = dateArray[0]
            const monthStr = Number(dateArray[1].split("")[0] === '0' ? dateArray[1].split("").splice(1, 1) : dateArray[1])
            const yearStr = dateArray[2]
            dateinString.push(dateStr+" "+month[monthStr-1]+","+yearStr) 
            return "";           
            })
        }
        localStorage.setItem("dateinString",JSON.stringify(dateinString)); 
    }

    return (
        <>        
        {/* <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=MYKEY"></script> */}
        <Box marginY={"2rem"} display={"flex"} flexDirection="column" alignItems={"center"} alignContent="center">
            {cardData.map((item, index) => {
                return (                    
                    <Box key={index} width={isMobile ? "350px" : "700px"} gap={isMobile?"10px":""} padding={["20px", "15px"]}
                     display="flex" paddingX="30px" flexDirection={isMobile ? "column" : "row"} alignItems="center" 
                     justifyContent={"space-between"} boxShadow="4px 4px 8px 0px rgba(20, 108, 197, 0.15)" marginBottom={"10px"}>
                        <Image src={item.thumbnail_url} width="25%" ></Image>
                        <Box>
                            <Text>{item.theatre_name}</Text>
                            <Text display="flex" alignItems={"center"} gap="10px"><StarFill size="1rem" color="#e6e600" />{`${item.customer_rating}/5`}</Text>
                        </Box>
                        <Box display="flex" justifyContent={"space-between"} gap="20px">                            
                          <Box _hover={{color: "#0047b3", cursor:"pointer"}}><Location size={isMobile?"1rem":"2rem"} /></Box>                        
                          <Box _hover={{color: "#0047b3", cursor:"pointer"}}>
                               <ArrowRightCircle size={isMobile?"1rem":"2rem"} cursor="pointer" onClick={() => handleClick(item)}/></Box>                         
                        </Box>
                    </Box>                    
                )
            })}   
        </Box>        
        </>
    )
}

export default TheatreCard;