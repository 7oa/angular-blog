import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  post: Post;
  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService) { }

  get f(){
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      })
    })
  }

  ngOnDestroy() {
    if (this.uSub) this.uSub.unsubscribe();
  }

  submit(){
    if (this.form.invalid) {
      return
    }

    this.loading = true;

    const newPost = {
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    };

    this.uSub = this.postService.update(newPost).subscribe(() => {
      this.loading = false;
      this.alertService.success('Post changed successfully!');
    }, () => {
      this.loading = false;
      this.alertService.danger('Error! Post has not been changed!');
    });
  }

}
