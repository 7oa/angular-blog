import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    text: new FormControl(null, [Validators.required]),
    author: new FormControl(null, [Validators.required])
  });
  loading = false;

  constructor(
    private postService: PostService,
    private alertService: AlertService) { }

  get f(){
    return this.form.controls;
  }

  ngOnInit(): void {
  }

  submit(){
    if (this.form.invalid) {
      return
    }

    this.loading = true;

    const post: Post = {
      title: this.form.value.title,
      author: this.form.value.author,
      text: this.form.value.text,
      date: new Date()
    }

    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Post created successfully!');
      this.loading = false;
    }, () => {
      this.alertService.danger('Error! Post was not created!');
      this.loading = false;
    });

  }

}
