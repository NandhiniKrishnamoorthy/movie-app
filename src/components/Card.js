import {SimpleGrid, Box, Image} from "@chakra-ui/react";

const Card = (props) => {
    const {cardData} = props;
    return (
        <Box width={"max-content"} display="flex" alignItems="center" alignContent={"center"} bg="red">
        <SimpleGrid columns={[1, 2, 2, 4]} mt="20px" spacingY='25px' spacingX={"30px"} alignItems={"center"} alignContent="center" >
            {cardData.map((item, index) => {
                return (
                    <Box key={index} display="flex" flexDirection={"column"} alignItems="center"> 
                        <Image src={item.thumbnail_url} alt="theatre" width="200px" height="250px"></Image>
                        <Box>
                            {item.movie_name}
                        </Box>
                    </Box>
                )
            })}            
        </SimpleGrid>
        </Box>
    )
}

export default Card;