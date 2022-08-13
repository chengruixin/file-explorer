import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  cardBox: {
    width: 350,
    margin: theme.spacing(2),
    cursor: 'pointer',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  ul: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
}))
