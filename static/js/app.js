// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filtermetadata = metadata.filter(number => number.id==sample);
    console.log(filtermetadata);
    let results = filtermetadata[0];
   

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in results){
        panel.append("h6").text(`${key}: ${results[key]}`)
      };
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtersamples = samples.filter(number => number.id===sample)[0];
    console.log(filtersamples);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtersamples.otu_ids;
    let otu_labels = filtersamples.otu_labels;
    let sample_values = filtersamples.sample_values;


    // Build a Bubble Chart
    let Bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode:'markers',
      marker:{
        color:otu_ids,
        size:sample_values,
        colorscale:"Cividis"
      },
      text: otu_labels
    };

    let Bubble_traces = [Bubble_trace];

    // Render the Bubble Chart
    let layout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };
    
    Plotly.newPlot('bubble', Bubble_traces, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_yticks = otu_ids.map(number => `OTU:${number}`);
    console.log(bar_yticks);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let Bar_trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_yticks.slice(0,10).reverse(),
      type: "bar",
      marker: {
         color: sample_values.slice(0, 10).reverse(),
         colorscale:"Viridis",
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }

    // Render the Bar Chart
    let Bar_traces = [Bar_trace];

    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: 'Number of Bacteria'}
    };
    
    Plotly.newPlot("bar", Bar_traces, layout2);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let first_sample = names[0];
    console.log(first_sample);

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialise the dashboard
init();
