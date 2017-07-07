import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/ti/delete';
import styles from './styles.scss';

const { arrayOf, object, any, bool, string, func } = PropTypes;

export const DataRow = ({ children, header, ...other }) => {
  const Column = header ? 'th' : 'td';

  return (
    <tr {...other}>
      {
        React.Children.map(children, (child, index) => {
          const colSpan = child && child.props && child.props.colSpan || 1;

          return React.createElement(Column, { key: index, colSpan }, child);
        })
      }
    </tr>
  );
};

DataRow.propTypes = {
  children: any,
  header: bool,
};

export default class DataTable extends PureComponent {
  static propTypes = {
    rows: arrayOf(object),
    columns: arrayOf(object),
    children: any,
    noHead: bool,
    className: string,
    onRowHover: func,
    onRowEditClick: func,
    onRowDeleteClick: func,
  };

  renderHeaders = () => (
    this.props.columns
      ? this.props.columns.map((colData, index) =>
        <th key={index}>{colData.label}</th>)
      : <th />
  );

  renderCells = (rowData) => (
    this.props.columns.map((colData, index) =>
      <td key={index} data-label={colData.label}>{rowData[colData.key]}</td>)
  );

  renderRows = () => {
    const {
      rows,
      children,
      onRowHover,
      onRowEditClick,
      onRowDeleteClick,
    } = this.props;

    if (rows) {
      return rows.map((item, index) => {
        const rowProps = { key: index };

        if (onRowHover) {
          rowProps.onMouseOver = () => onRowHover(item);
        }

        return (
          <tr {...rowProps} >
            {this.renderCells(item)}
            {
              onRowEditClick &&
              <td>
                <EditIcon
                  className={styles.editIcon}
                  onClick={() => onRowEditClick(item)}
                />
              </td>
            }
            {
              onRowDeleteClick &&
              <td>
                <DeleteIcon
                  className={styles.deleteIcon}
                  onClick={() => onRowDeleteClick(item)}
                />
              </td>
            }
          </tr>
        );
      });
    }

    return children;
  }

  render() {
    const { className, noHead } = this.props;

    return (
      <table className={`${styles.dataTable} ${className}`}>
        {
          !noHead &&
          <thead><tr>{this.renderHeaders()}</tr></thead>
        }
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}
