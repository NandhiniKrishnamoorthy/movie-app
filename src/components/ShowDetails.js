import {
    Box, Button, Image, useBreakpointValue, SimpleGrid, Text, useDisclosure, Modal,
    ModalBody,
    ModalOverlay,
    ModalContent, Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "../components/Header"
import { StarFill } from "@emotion-icons/bootstrap";

const BookingSlots = (props) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { totalSeats, blockedSeats, bookedSeats, setBookedSeats } = props;

    const addBookedSeats = (seatNo) => {
        bookedSeats.includes(seatNo) ? setBookedSeats(bookedSeats.filter((i) => i !== seatNo)) :
            setBookedSeats([...bookedSeats, seatNo])
    }
    console.log("bookedSeats", bookedSeats);

    const steps = [];
    for (let i = 1; i <= totalSeats; i++) {
        steps.push(<Button key={i} bg={blockedSeats.includes(i) ? "#e63029" : bookedSeats.includes(i) ? "#219430" : "#d7d9d7"} size={isMobile ? "xs" : "md"}
            isDisabled={blockedSeats.includes(i) ? true : false}
            // bg={blockedSeats.includes(i) ? "#e63029" : ""}
            onClick={() => addBookedSeats(i)}>{i}</Button>);
    }
    return (<SimpleGrid columns={10} gap="10px" marginX={isMobile ? "20px" : "0px"} >{steps}</SimpleGrid>);
};

const BookingSlotsModal = (props) => {
    const { open, onClose, totalSeats, blockedSeats, bookedSeats, setBookedSeats } = props;
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <>
            <Modal
                isOpen={open}
                onClose={onClose}
                blockScrollOnMount={true}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody alignItems="center"
                        textAlign={"center"}
                        alignContent="center"
                        justifyContent={"center"}
                    >
                        <Box>
                            <Box>
                                <Box>
                                    <Box bg="#4d5ae3" borderRadius={"30px"} color="white" mb="50px" mt="20px" marginX={isMobile ? "20px" : "10px"}>Screen This WAY</Box>
                                    <BookingSlots totalSeats={totalSeats} blockedSeats={blockedSeats} bookedSeats={bookedSeats} setBookedSeats={setBookedSeats} />
                                    <Box display={"flex"} alignItems="center" alignContent={"center"} justifyContent="center" gap={"15px"} mt="15px">
                                        <Box width="15px" height="15px" bg="#e63029" opacity={"0.4"}></Box><Text>Booked</Text>
                                        <Box width="15px" height="15px" bg="#d7d9d7" ></Box><Text>Available</Text>
                                        <Box width="15px" height="15px" bg="#219430" ></Box><Text>Selected</Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box my={"25px"}><Button bg='OrangeRed' onClick={() => onClose()}>Book Tickets</Button></Box>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

const ShowDetails = () => {
    const [selectedDate, setSelectedDate] = useState({});
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [bookedDate, setBookedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [blockedSeats, setBlockedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedIndexDate, setSelectedIndexDate] = useState(1000);
    const [selectedIndexTime, setSelectedIndexTime] = useState(1000);
    const selectedTheatre = JSON.parse(localStorage.getItem("selectedTheatre"))
    const dateinString = JSON.parse(localStorage.getItem("dateinString"))
    const apiData = JSON.parse(localStorage.getItem("apiData"));
    const movieData = apiData.movies;
    const isMobile = useBreakpointValue({ base: true, md: false });
    const totalSeats = 100;

    const {
        isOpen: isBookingSlotsModalOpen,
        onOpen: onBookingSlotsModalOpen,
        onClose: onBookingSlotsModalClose,
    } = useDisclosure();

    const consolidateObject = (item) => {
        // Create a separate array of Objects based on shows
        delete item["date"]
        let ResponseJsonArray = [];
        let keys = Object.keys(item);

        for (let i = 0; i < keys.length; i++) {
            let currentKey = keys[i];
            let currentKeyIndex = (currentKey.split("_")[0].split("show")[1]) - 1

            if (ResponseJsonArray[currentKeyIndex] === undefined) {
                ResponseJsonArray[currentKeyIndex] = {}
            }

            // rename keys of object with unique name
            let objKey = currentKey.split("")
            objKey.splice(4, 1)
            objKey = objKey.join("")

            ResponseJsonArray[currentKeyIndex][objKey] = item[currentKey]
        }

        // remove empty objects
        let updatedResponseJsonArray = [];
        let newIndex = 0;
        for (let i = 0; i < ResponseJsonArray.length; i++) {
            if (ResponseJsonArray[i] != null) {
                updatedResponseJsonArray[newIndex] = ResponseJsonArray[i];
                newIndex++;
            }
        }
        setTimeSlots(updatedResponseJsonArray);
    }

    const handleClick = (item, index) => {
        // Add movie name with objectr        
        for (const key1 in selectedTheatre) {
            for (const key2 in item) {
                if (key1.includes(key2.split("_")[0]) && key1.includes("movie")) item[key1] = selectedTheatre[key1]
            }
        }
        setSelectedDate(item);
        setBookedDate(dateinString[index]);
        setSelectedIndexDate(index);
        setSelectedIndexTime(1000);
        setSelectedMovie("");
        consolidateObject(item)
    }

    const showBookingDetails = (data, index) => {
        setSelectedTime(data.show_time)
        setSelectedMovie(data.show_movie)
        const item = data.show_booked_seats ? data.show_booked_seats : "today"
        if (item === "today") {
            setBlockedSeats([0])
        }
        else {
            const seats = JSON.parse(item[1] === "," ? item.replace(",", "") : item)
            setBlockedSeats(seats)
        }
        if (selectedTime !== data.show_time) setBookedSeats([])
        setSelectedIndexTime(index)
    }

    console.log("bookedDate", bookedDate, "selectedTime", selectedTime, "selectedMovie", selectedMovie, "bookedSeats", bookedSeats)
    return (
        <Box>
            <Header />

            <Box display={"flex"} flexDirection="column" alignItems={"center"} alignContent="center">
                {/* Display theatre name, Address and Image */}
                <Box display={"flex"} gap="20px" flexDirection="column" alignItems={"center"} alignContent="center" marginX={isMobile ? "10px" : ""} paddingY="25px">
                    <Box fontSize={"lg"} fontWeight="700">{selectedTheatre.theatre_name}</Box>
                    <Box>{selectedTheatre.address}</Box>
                    <Image src={selectedTheatre.thumbnail_url} maxW="250px" maxH={"250px"}></Image>
                </Box>
                {/* display dates  */}
                <Box mb="20px">
                    <Box fontWeight={"500"} mb="15px">Available Dates</Box>
                    <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} gap="10px" >
                        {selectedTheatre.booked_seats ?
                            selectedTheatre.booked_seats.map((item, index) => {
                                const isClicked = index === selectedIndexDate
                                return (
                                    <Box key={index}>
                                        <Box><Button border="1px solid #6666ff" bg={isClicked ? "#6666ff" : ""} onClick={() => handleClick(item, index)}>{dateinString[index]}</Button></Box>
                                    </Box>
                                )
                            }) :

                            <Box><Button border="1px solid #6666ff" onClick={() => consolidateObject(selectedTheatre)}>Today</Button></Box>
                        }
                    </Box>
                </Box>

                {/* display timeslots */}
                <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap="10px">
                    {timeSlots.map((item, index) => {
                        const isClicked = index === selectedIndexTime
                        return (
                            <Box key={index} display="flex" flexDirection={"column"} gap="5px" boxShadow="1px 2px 3px 4px rgba(18,18,18,0.1)" padding={"20px"}>
                                <Button bg={isClicked ? "#6666ff" : ""} border="1px solid #6666ff" onClick={() => showBookingDetails(item, index)}>{item.show_movie}</Button>
                                <Box fontWeight={"700"}>{item.show_time}</Box>
                            </Box>
                        )
                    })}
                </Box>

                {/* display movie details*/}
                <Box my={isMobile ? "20px" : "50px"}>
                    {movieData.map((movie, index) => {
                        return (movie.movie_name === selectedMovie ?
                            <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} gap="30px" alignItems={"center"} alignContent="center">
                                <Image src={movie.thumbnail_url} width="200px" height="250px"></Image>
                                <Box display="flex" flexDirection={"column"} alignItems={"center"} alignContent="center" gap="10px" fontWeight={"500"}>
                                    <Box>{movie.language}</Box>
                                    <Box>{movie.release_date}</Box>
                                    <Box>{movie.running_time}</Box>
                                    <Box>{movie.tags}</Box>
                                    <Box display="flex" alignItems={"center"} gap="10px"><StarFill size="1rem" color="#e6e600" />{`${movie.imdb_rating} / 10`}</Box>
                                    <Box><Button bg='OrangeRed' onClick={() => onBookingSlotsModalOpen()}>Book Tickets</Button></Box>
                                </Box>
                            </Box> : <></>)
                    })}
                </Box>

                <BookingSlotsModal
                    open={isBookingSlotsModalOpen}
                    onClose={onBookingSlotsModalClose}
                    totalSeats={totalSeats}
                    blockedSeats={blockedSeats}
                    bookedSeats={bookedSeats}
                    setBookedSeats={setBookedSeats}
                />
                {
                    (selectedMovie && selectedTime && bookedDate && bookedSeats.length > 0) && <>
                        <Box mb="40px">
                            <Alert status='success'>
                                <AlertIcon />
                                {`You have successfully booked ${bookedSeats.length} tickets for ${selectedMovie} \n 
                                ${bookedDate} ${selectedTime}`}
                            </Alert>
                        </Box></>
                }
            </Box>
        </Box>
    )
}

export default ShowDetails;