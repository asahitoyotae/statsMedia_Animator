import React from "react";

const Article = () => {
  return (
    <div className="w-full px-1 sm:px-3 md:px-40 lg:px-72 my-9">
      <h1 className="text-black font-bold text-2xl my-8 md:text-4xl ">
        Create a Radial Area Chart
      </h1>
      <p className="text-black text-lg md:text-xl tracking-wide leading-[2]  md:leading-[2]">
        Visualize your boring data from excel file to a nice and appealing chart
        or convert your good old line or area chart into a most radial
        representation.
      </p>

      <h2 className="text-black font-bold text-xl md:text-2xl my-6">
        What is Radial Area Chart?
      </h2>
      <p className="text-black text-lg md:text-xl tracking-wide leading-[2]  md:leading-[2]">
        A great use of Radial area chart is to show readers temporal patterns
        over a cyclical period. A great example is using the above example graph
        which shows temperature fluctuation over a single year. It can also be
        used to represent sales data of an establishment or a particular product
        over a cycle of 1 whole year. This is most useful in making insights of
        repeated patterns and seasonality. The uncommon and unconventional
        circular layout of a radial chart makes a reader engage or encourages
        them to explore more on data from a different perspective.
      </p>

      <h2 className="text-black font-bold text-xl md:text-2xl my-6">
        Our Radial Area chart consists of:
      </h2>
      <ol className="list-decimal pl-8">
        <li className="my-4 text-black text-lg md:text-xl tracking-wide leading-[2] md:leading-[2]">
          <span className="font-bold">Circular line –</span> it can represent
          average data of the actual sales of a particular product or anything
          in one cycle. In our example, it represents average temperature during
          that particular cycle.
        </li>
        <li className="my-4 text-black text-lg md:text-xl tracking-wide leading-[2] md:leading-[2]">
          <span className="font-bold">Inner circular Area –</span> represents
          minimum and maximum of a possible outcome of something like sales or
          temperature during the cycle. In the case of the example above, it
          represents the minimum and maximum temperature of the day in the
          entire cycle.
        </li>
        <li className="my-4 text-black text-lg md:text-xl tracking-wide leading-[2] md:leading-[2]">
          <span className="font-bold">Outer circular area –</span> If provided
          it means the absolute maximum and absolute minimum of the possible
          outcome of the value can be.
        </li>
        <li className="my-4 text-black text-lg md:text-xl tracking-wide leading-[2] md:leading-[2]">
          <span className="font-bold">Months –</span> the entire circle is
          divided into periods which represent a single month. A single column
          or division is a single period of the entire cycle.
        </li>
        <li className="my-4 text-black text-lg md:text-xl tracking-wide leading-[2] md:leading-[2]">
          <span className="font-bold">Value labels –</span> it is provided to
          easily determine the level of outcome, it may be low or high.
        </li>
      </ol>

      <h2 className="text-black font-bold text-xl md:text-2xl my-6">
        How to use our Radial Chart generator?
      </h2>
      <p className="text-black text-lg md:text-xl tracking-wide leading-[2]  md:leading-[2]">
        Datalytics radial chart generator is simple and very easy to use, but
        you need to understand first how the data is structured inside your
        .xlsx file or in common terms Excel file. To do that, first download the
        sample data provided on the chart maker. Once you understand and
        structure your data, upload your own data to the chart maker and click
        process data. It will automatically make the chart for you. You can
        change the color by typing the color you desire. Acceptable colors are:
        red, blue, green, … It also accepts rgba() color structure and Hex
        #234234, just make sure it's a valid color. Editing the title and
        providing more information about the chart are also possible. If you
        reached your desired liking, you can then proceed to saving the chart as
        an image/png to present it anywhere else for free.
      </p>

      <h2 className="text-black font-bold text-xl md:text-2xl my-6">
        Why choose our Radial chart generator?
      </h2>
      <p className="text-black text-lg md:text-xl tracking-wide leading-[2]  md:leading-[2]">
        Depending on your needs, something these types of charts or graphs can
        accommodate your visualization and data structure. It is a free, simple,
        and easy-to-use chart maker yet appealing to all types of audiences.
      </p>
    </div>
  );
};

export default Article;
