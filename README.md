# Our Forests Tomorrow: Visualizing European forests future

![](https://raw.githubusercontent.com/developmentseed/our-forests-tomorrow/main/public/img/forest.webp)

In February 2022 European researchers published the [Eu-Trees4F study](https://publications.jrc.ec.europa.eu/repository/handle/JRC127314), comprised of a dataset that predicts the extent of 67 tree species in Europe, in 2035, 2065 and 2095, on a 10km grid, according to a whole range of bioclimatic parameters and on two different RCPs (intermediate 4.5 and BAU 8.5).

The amount of considered species, the precision of the simulation and the relatively high spatial resolution makes this dataset an absolute goldmine for forestry, research, biodiversity, but considering how the issue of forests has become salient in the public opinion, this could also be interesting to a really broad audience. Where I live in the West of France, people would be shocked to learn that our beloved beech trees, birch trees, aspens, will be likely gone within 45 years. But with a little help (in the form of assisted migration), the forests here could see new species thrive like Mediterranean oaks, willow trees, etc.

The goal of that project is to bring those findings to a large audience, building interactive product(s) such as a minisite and notebooks, and through media partners.

## What are we up to?

- The mini site prototype: [Our Forests Tomorrow](https://devseed.com/our-forests-tomorrow/)

![205045050-fa1d002e-dc6e-452c-9da2-d2ee16570722](https://user-images.githubusercontent.com/1583415/229806619-7c63049e-74c3-402a-81eb-ef6e1295d806.png)

- Based on that initial work, we ran several [technical/design experiments](https://github.com/developmentseed/our-forests-tomorrow/issues/1)
- Work on the way to develop a visual identity as well as high-fidelity designs for a final version of the minisite
- We developed two stories based on the initial study, currently drafted as Observable notebooks:
  - [Jamón ibérico under threat from climate crisis](https://observablehq.com/@nerik/eu-trees4f-jamon-iberico-under-threat-from-climate-crisis)
  - [Positive effects of climate change and warmer conditions for European trees](https://observablehq.com/@nerik/eu-trees4f-positive-effects-of-climate-change-and-warmer-co)
  - see [working document](https://paper.dropbox.com/doc/EUTrees-4F-Storytelling--B1xvfzlZQDPKG9WqxC_iDGmmAg-0dzBRWbdXLaLB3DIZZ6lE) (private)

Internal use only/private documents:
- [Labs phase 1 ticket](https://github.com/developmentseed/labs/issues/296)
- [Labs phase 2 ticket](https://github.com/developmentseed/labs/issues/283)
- [Team week slides](https://docs.google.com/presentation/d/1sRQSuknT50N6ysPNUXxmHZbfnZDjxMRk8rsXJRIXA4U/edit#slide=id.gb700de37bd_0_524)
- [Pitch slides deck](https://docs.google.com/presentation/d/18SjpRg7HhnR_Acjt3FmFDx5ecDaAn__TVhbaKrx6MpA/edit#slide=id.gb700de37bd_0_524)
- [Figma wireframes + high fidelity designs](https://www.figma.com/file/Yoa1s61W6Q2NvK5z7jHygx/Our-forests-tomorrow?node-id=182-3326&t=oBWVrEvmbG2vf5WN-0)

## About the dataset

The original dataset consists of a series of GeoTIFF files covering mostly the European Union + some Eastern European countries. There is data for:
- 67 tree species
- 2 emissions scenarios (RCP 4.5 and 8.5)
- 2 modelled outputs (climatic ensemble mean and SDM ensemble mean)
- The 2005 baseline + 3 time steps (2035, 2065, 2095)
- Data is gridded on a 10km grid
- Data is scaled on a continuous scale running from 0 (species absent) to 1 (species extremely likely to be suitable) 

Comparing with the 2005 baseline extent, the main visualisation goal is to assess what will happen in European regions:
- Is the species __stable__?
- Is the species likely to disappear/__decolonize__? (present in 2005, not present in the future timestep)
- Is the species newly __suitable__? (not present in 2005, but conditions allow thriving in the future timestep)
...for the three future timesteps, under the two emissions scenarios, for each of the 67 species.

Datasets currently used in the prototype minisite (only RCP P8.5):
- A stats JSON file that represents the number of cells falling into each of the stable/decolonize/suitable class, for each timestep, for each region and country. This is used to generate the small multiples charts for each region
- A static vector tileset (MVT), points sampled from the GeoTIFFs along an hex grid, containing the class for each timestep. Generated for 10km, 20km, 40km grids

Other datasets generated:
- GeoJSON files (point geometries) for each species with continuous values for each timestep under the two RCPs
- GeoJSON files (hexagon geometries) - needed to render in Mapbox GL which is not able to render hexes on the fly from points
- TopoJSON extents


## Run the minisite prototype locally

Clone this repo and:
```
yarn
yarn start
```

