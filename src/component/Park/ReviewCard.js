import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Rating from 'react-rating';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

import utils from '../../utils/utils';

import full from './star_readonly.svg';
import empty from './star_empty.svg';
import checked from './checked_review.svg';
import crossed from './cancel_review.svg';

import './ReviewCard.css';

const styles = (theme) => ({
	avatar:{
		height: 60,
		width: 60,
	},
	cardHeader:{
		background: '#0d3752',
		paddingTop: 10,
		paddingBottom: 10,
	},
	star:{
		width: 20,
		height: 20
	},
	reviewContent:{
		padding: '10px 0px'
	},
	enlargeContent:{
	    padding: '5px!important',
	    paddingBottom: '2px !important'
	},
	vote:{
		borderRadius: '1000px',
		borderWidth: 2,
		borderStyle: 'solid',
		'&:hover':{
			color: 'white'
		},
		marginRight: 8
	},
	upvote:{
		borderColor: '#00cc66',
		color: '#00cc66',
		'&:hover': {
			backgroundColor: '#00cc66',
	    },
	},
	downvote:{
		borderColor: '#ff6666',
		color: '#ff6666',
		'&:hover': {
			backgroundColor: '#ff6666',
	    },
	},
	upvoted:{
		color: 'white',
		backgroundColor: '#00cc66'
	},
	downvoted:{
		color: 'white',
		backgroundColor: '#ff6666'
	}
})

function rand() {
  	return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
	const top = 50 + rand();
	const left = 50 + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

class ReviewCard extends Component{
	constructor(props){
		super(props);
		this.state = {
			open: false,
			imgurl:""
		}
		this.enlargeImg = this.enlargeImg.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.getDimension = this.getDimension.bind(this);
	}

	enlargeImg(e){
		this.setState({open: true, imgurl: e.target.src});
	}

	handleClose(){
		this.setState({open: false});
	}

	getDimension({target:img}){
		this.setState({imgAspectRatio: img.offsetWidth / img.offsetHeight});
	}

	render(){
		const { classes } = this.props;

		const images = utils.importAll(require.context('../../../public/img/avatar', false));

		const review_imgs = utils.importAll(require.context('../../../public/img/review', false));
		
		const info = this.props.info;

		return (
			<div>
				<Card className={classes.card}>
			        <CardHeader
			          avatar={
			            <Avatar src={images[info.userId.profile_img == '' ? 'default.svg' : info.userId.profile_img]} alt={info.userId.username} className={classes.avatar} />
			          }
			          title={info.userId.username}
			          subheader={"photos: " + info.userId.contribution_img + "  reviews: " + info.userId.contribution_review}
			          className={classnames(classes.cardHeader, "cardHeader")}
			        />
			        <CardContent>
				        <Grid container spacing={16} alignItems="center">
					  		<Grid item>
						  		<Rating 
						      		initialRating={info.rating}
						      		emptySymbol={<img src={empty} className={classes.star} />}
						      		fullSymbol={<img src={full} className={classes.star} />}
						      		readonly
						  		/>
					  		</Grid>
					  		<Grid item>
						  		<Typography component="p" variant="caption">
					            	{utils.calcPostTime(info.post_time)}
						        </Typography>
					        </Grid>
				        </Grid>
			          	<Typography component="p" className={classes.reviewContent}>
			            	{info.content}
				        </Typography>
				        <GridList cellHeight={100} className={classes.gridList} cols={4}>
					        {info.related_images.map((e, i) => (
					          <GridListTile key={i} cols={1}>
					            <img src={review_imgs[e]} alt={"images-" + i} className="review_area_img" onClick={this.enlargeImg}/>
					          </GridListTile>
					        ))}
			      		</GridList>
			        </CardContent>
			        <CardActions className={classes.actions} disableActionSpacing>
			        	<Button className={classnames(classes.vote, classes.upvote, this.props.votes.upvote ? classes.upvoted : "")} onClick={() => this.props.voteHandler("u_" + info._id)}>
			        		{this.props.votes.upvote && <span><img src={checked} className="review_icon"/>&ensp;</span>}
			        		Useful&ensp;
			        		<p className={this.props.votes.upvote ? "vote_bubble vote_bubble_selected_upvote" : "vote_bubble vote_bubble_default_upvote"}>{info.upvotes}</p>
		        		</Button>
			        	<Button className={classnames(classes.vote, classes.downvote, this.props.votes.downvote ? classes.downvoted : "")} onClick={() => this.props.voteHandler("d_" + info._id)}>
			        		{this.props.votes.downvote && <span><img src={crossed} className="review_icon"/>&ensp;</span>}
			        		Inappropriate&ensp;
		        			<p className={this.props.votes.upvote ? "vote_bubble vote_bubble_selected_downvote" : "vote_bubble vote_bubble_default_downvote"}>{info.downvotes}</p>
		        		</Button>
			        </CardActions>
		      	</Card>
		      	{this.state.open && (
		        	<Lightbox
		            mainSrc={this.state.imgurl}
		            onCloseRequest={() => this.setState({ open: false })}
		          />
		        )}
	      	</div>
		)
	}
}


ReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewCard);