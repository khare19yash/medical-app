import React, { useState, useEffect, useContext } from 'react';
import {decode as atob, encode as btoa} from 'base-64';
import { Autocomplete, Grid, Typography, Button, TextField, styled, ImageList, ImageListItem, Select, MenuItem, Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SelectForm from "../functions/Select";
import { AppStateContext } from "../AppState";

const Container = styled('div')({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
});


const SearchContainer = styled('div')({
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  });


const SearchBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50px',
    backgroundColor: '#fff',
    padding: '5px 15px',
    boxShadow: '0px 0px 5px #888888',
  });
  
  const SearchInput = styled(TextField)({
    border: 'none',
    marginLeft: '10px',
    width: '100%',
    '& .MuiInputBase-input': {
      fontSize: '16px',
    },
    '& .MuiInputBase-input:focus': {
      outline: 'none',
    },
  });
  
  const SearchButton = styled(Button)({
    borderRadius: '50px',
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '5px 15px',
    marginLeft: '10px',
    width: '100%',
    maxWidth: '150px'
  });
  
  const SearchResult = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  });
  
  const ResultImage = styled('img')({
    maxWidth: '100%',
    height: 'auto',
  });
  
  const ResultText = styled(Typography)({
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  });





const VQA = (props) => {

  // const { query,setQuery,result,setResult,options,setOptions,imageData,setImageData,image,setImage} = useContext(AppStateContext);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]);


  const [imageData, setImageData] = useState(null);

  const [image, setImage] = useState('');

  const [dataset, setDataset] = useState('');

  const handleChange = (event) => {
    setDataset(event.target.value);
  };

  const handleChildData = (childData) => {
    setImage(childData);
  };
  useEffect(() => {
    if (image) {
      fetchImage();
    }
  }, [image]);


  const fetchImage = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/loadimage?image=${encodeURIComponent(image)}`);
      const data = await response.json();

      // Decode the base64-encoded image
      const decodedImage = atob(data.image);

      // Create a byte array from the decoded image data
      const byteArray = new Uint8Array(decodedImage.length);
      for (let i = 0; i < decodedImage.length; i++) {
        byteArray[i] = decodedImage.charCodeAt(i);
      }

      // Create a blob URL for the image
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      // Set the result in the state
      setOptions(data.questions);
      setImageData({
        image: imageUrl,
      });
    } catch (error) {
      console.error(error);
      setImageData(null);
    }
  };


  // const [auto, setAuto] = useState([]);

  // useEffect(() => {
  //   fetchAuto()
  // }, []);


  // const fetchAuto = () => {
  //   fetch('http://127.0.0.1:5000/autocomplete')
  //   .then(response => response.json())
  //   .then(data => setAuto(data.questions))
  //   .catch(error => console.error(error));
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://127.0.0.1:5000/getanswer?image=${encodeURIComponent(image)}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Answer-----")
    console.log(data.answer);
    setResult(data.answer);
  };

  return (

      <Box width={1}>
        <Box>
          <SearchBox>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dataset}
            label="Dataset"
            onChange={handleChange}
          >
            <MenuItem value={10}>VQARAD</MenuItem>
            <MenuItem value={20}>MedVQA</MenuItem>
          </Select>
        </FormControl>

            <SelectForm onChildData={handleChildData}></SelectForm>
            {/* <Select defaultValue={dataset_options[0].value}>
              {dataset_options.map(option => (
              <MenuItem key={option.value} value={option.value}>
              {option.label}
              </MenuItem>
              ))}
            </Select> */}
            {/* <SearchInput
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            /> */}
                <Autocomplete
                id="text-field-autocomplete"
                fullWidth
                options={options}
                getOptionLabel={(option) => option}
                onChange={(event, value) => setQuery(value)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Enter Question"
                    variant="outlined"
                    // fullWidth
                    value={query}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit();
                        }
                      }}
                    />
                )}
                />  

            <SearchButton onClick={handleSubmit}>Get Answer</SearchButton>
          </SearchBox>
          {imageData && (
            <SearchResult>
              {/* <ResultImage src={imageData.image} alt="Search Result" /> */}
              {result && (
              
              <ResultText>
                <span>Answer: </span>
                {result}
                </ResultText>
          )}

              <ImageList sx={{ width: 800, height: 800 }} cols={3} rowHeight={164}>
                <ImageListItem>
                <img
                  src={imageData.image}
                  alt="Search Result"
                  loading="lazy"
                />
                </ImageListItem>
            </ImageList>

           

              {/* <ResultText>{result.text}</ResultText> */}
            </SearchResult>
          )}


        </Box>
    </Box>


  );

};
    export default VQA;



