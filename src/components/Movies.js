import Header from "./Header";
import {Box, SimpleGrid, Image} from "@chakra-ui/react"

const Movies = () => {
    const apiData =  JSON.parse(localStorage.getItem("apiData"));    
    const movieData = apiData.movies; 
    return (
        // <Box display={"flex"} flexDirection="column" alignItems={"center"} alignContent="center">
        <Box>
            <Header />
            <Box display={"flex"} justifyContent={"center"} justifyItems="center">
            <SimpleGrid columns={[1, 2, 2, 5]} mt="20px" spacingY='40px' spacingX={"30px"} >
            {movieData.map((item, index) => {
                return (
                    <Box key={index} display="flex" flexDirection={"column"} alignItems="center"
                     maxW="max-content" boxShadow="1px 2px 3px 4px rgba(18,18,18,0.1)" > 
                        <Image src={item.thumbnail_url} alt="theatre" width="200px" height="250px"></Image>
                        <Box fontWeight={"600"} fontSize="lg">
                            {item.movie_name}
                        </Box>
                    </Box>
                )
            })}            
        </SimpleGrid>
        </Box>
        </Box>
    )
}

export default Movies;