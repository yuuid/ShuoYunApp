import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'teaset';

import { NavigationPage, Theme, Wheel } from 'teaset';

export default class DatePicker extends Component {

  // static defaultProps = {
  //   // ...NavigationPage.defaultProps,
  //   navigationBarInsets: false,
  //   // title: 'Wheel',
  //   showBackButton: false,
  // };

  constructor(props) {
    super(props);
    // this.years = [];
    // for (let i = 1970; i <= 2100; ++i) this.years.push(i);
    // this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    // this.daysCount = [
    //   [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    //   [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    // ];
    // Object.assign(this.state, {
    //   date: new Date(),
    // });
    this.state = {
      newdate: new Date(),
      years: [],
      months: [],
      daysCount: [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      ],
    }
    Object.assign(this.state, {
      date: new Date(),
    });
  }

  componentDidMount() {
    let years = [];
    for (let i = 1970; i <= 2100; ++i) years.push(i);
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
   
    this.setState({ years, months })
     
  }

  isLeapYear(year) {
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
  }

  onDateChange(year, month, day) {
    let { date, daysCount } = this.state;
    date.setFullYear(year);

    let daysCounts = daysCount[this.isLeapYear(year) ? 1 : 0][month];
    if (day > daysCounts) {
      day = daysCounts;
      date.setDate(day);
      date.setMonth(month);
    } else {
      date.setMonth(month);
      date.setDate(day);
    }
    this.setState({ date, newdate: year +'-'+month+'-'+ day });
  }

  render() {
    let { date, daysCount, newdate } = this.state;
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let daysCounts = daysCount[0][month];
    let days = [];
    for (let i = 1; i <= daysCounts; ++i) days.push(i);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Theme.defaultColor, padding: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <Wheel
            style={{ height: 200, width: 80 }}
            itemStyle={{ textAlign: 'center' }}
            items={this.state.years}
            index={this.state.years.indexOf(year)}
            onChange={index => this.onDateChange(this.state.years[index], month, day)}
          />
          <Wheel
            style={{ height: 200, width: 80 }}
            itemStyle={{ textAlign: 'center' }}
            items={this.state.months}
            index={this.state.months.indexOf(month + 1)}
            onChange={index => this.onDateChange(year, this.state.months[index] - 1, day)}
          />
          <Wheel
            style={{ height: 200, width: 80 }}
            itemStyle={{ textAlign: 'center' }}
            items={days}
            index={days.indexOf(day)}
            onChange={index => this.onDateChange(year, month, days[index])}
          />
        </View>
        <Button title='确定' onPress={() => this.props.setTime(newdate)} />
      </View>
    );
  }

}