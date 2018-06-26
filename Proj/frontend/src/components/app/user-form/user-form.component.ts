import { Input, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {UserApiService} from "../../../services/user-api-service";
import {User} from "../../../classes/user";
import {Observable} from "rxjs";
import {PlaylistInfoInterface} from "../../../classes/playlist-info-interface";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input()
  user: User;

  //link for currently selected playlist to lookup
  selectedPlaylistId: number;
  selectedPlaylist: PlaylistInfoInterface;
  uname: string;
  private sub: any;
  private yes: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: UserApiService) {

  }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.uname = params['id'];
    });

    /*this.service.getUser(this.uname).subscribe(thing =>
      this.user$ = {playlists:[],spotid: thing['spot_uname'],name:thing['name']
      }
    );

    // In a real app: dispatch action to load the details here.
  });*/
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getUser(params.get("id")))
    ).subscribe(thing =>
      this.user = {
        playlists: [], spotid: thing['spot_uname'], name: thing['name']
      });

    console.log(this.uname);

    this.service.getPlaylists(this.uname).subscribe(thing =>
      this.user.playlists = thing);

    this.yes = true;

  }

  selectChange(args) {
    console.log(this.user.playlists[0]);
    this.selectedPlaylistId = args.target.value;
    this.selectedPlaylist = this.user.playlists[this.selectedPlaylistId];
    console.log(this.selectedPlaylistId);
    console.log(this.selectedPlaylist);
  }

  calculatePlaylist(){
    this.service.lookupPlaylist(this.uname, this.selectedPlaylist.playlistId).subscribe(thing =>
      this.user.playlists[this.selectedPlaylistId].feels.sentiment = thing)

  }

  isYes() {
    return this.yes;
  }

  getUser() {

    console.log(this.user);
  }

  getSpot() {
  }
}
